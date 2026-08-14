// Repository layer - direct database access
// Uses Prisma/PostgreSQL exclusively (no in-memory fallback)
// v2 schema: location normalized into Location relation, levels/languages enums,
// Program requires qualificationId, verificationStatus enum replaces `verified`.

import { prismaClient } from "../../lib/database.js";
import { calculateDistanceKm, attachDistance } from "../../lib/distance.js";

// ---- Legacy API value -> v2 enum mappings ----
const LEVEL_MAP = {
  PrimaryNursery: ["NURSERY", "PRIMARY"],
  Secondary: ["SECONDARY"],
  University: ["HIGHER"],
  // accept raw enum values too
  NURSERY: ["NURSERY"],
  PRIMARY: ["PRIMARY"],
  SECONDARY: ["SECONDARY"],
  HIGHER: ["HIGHER"],
};
const LANG_MAP = { Anglophone: "ENGLISH", Francophone: "FRENCH", Bilingual: "BILINGUAL" };
const toUpperEnum = (v) => String(v).toUpperCase();

const INCLUDE_RELS = {
  programs: { include: { qualification: true } },
  images: { orderBy: { order: "asc" } },
  location: true,
  secondarySections: true,
  faculties: {
    include: {
      departments: { include: { programs: { include: { qualification: true } } } },
    },
  },
};

// ---- Legacy API compatibility serialization ----
// The v2 schema stores normalized data (Location relation, enum arrays for
// levels/languages, images[], verificationStatus). The frontend (public site,
// school details) was built against the legacy flat v1 shape that
// had top-level region/city/latitude/longitude/category/imageUrl/verified plus
// `program.level`. `serializeSchool` attaches those legacy fields to the v2 row
// so all existing consumers work without changes; the v2 fields remain intact.

function legacyCategory(levels = []) {
  if (levels.includes("HIGHER")) return "University";
  if (levels.includes("SECONDARY")) return "Secondary";
  return "PrimaryNursery";
}

function legacyProgramLevel(program) {
  const type = program?.qualification?.type;
  const name = (program?.qualification?.name ?? "").toLowerCase();
  if (type === "SCHOOL_LEAVING") {
    if (name.includes("technical")) return "Technical";
    if (name.includes("commercial")) return "Commercial";
    if (/advanced|a-?level|baccalaur|sixth/.test(name)) return "High School";
    return "Secondary";
  }
  return program?.qualification?.name || "Other";
}

function legacyStreams(sections = []) {
  const streams = [];
  for (const section of sections) {
    if (section.section === "GENERAL") {
      if (!streams.includes("General")) streams.push("General");
    } else if (section.section === "TECHNICAL") {
      const stream = section.track === "COMMERCIAL" ? "Commercial" : "Technical";
      if (!streams.includes(stream)) streams.push(stream);
    }
  }
  return streams;
}

// Aggregate programs attached directly to the school plus any linked via
// faculties -> departments (universities store programs under departments).
function allPrograms(school) {
  const direct = school.programs ?? [];
  const departmental = (school.faculties ?? []).flatMap((f) =>
    (f.departments ?? []).flatMap((d) => d.programs ?? [])
  );
  const seen = new Set();
  return [...direct, ...departmental].filter((p) => {
    if (!p?.id || seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

function serializeSchool(school) {
  if (!school) return school;
  const loc = school.location;
  const images = school.images ?? [];
  const primaryImage = images.find((i) => i.isPrimary) ?? images[0];
  const levels = school.levels ?? [];
  const languages = school.languages ?? [];
  const legacyCurriculum = languages.includes("BILINGUAL")
    ? "Bilingual"
    : languages.includes("FRENCH")
      ? "Francophone"
      : languages.includes("ENGLISH")
        ? "Anglophone"
        : undefined;

  return {
    ...school,
    // Legacy flat fields (v1 API shape)
    region: loc?.region ?? school.region ?? "",
    city: loc?.city ?? school.city ?? "",
    address: loc?.address ?? school.address ?? "",
    latitude: loc?.latitude ?? school.latitude ?? null,
    longitude: loc?.longitude ?? school.longitude ?? null,
    category: legacyCategory(levels),
    offersHighSchool: levels.includes("SECONDARY"),
    imageUrl: primaryImage?.url ?? school.imageUrl,
    verified: school.verificationStatus === "VERIFIED",
    language: legacyCurriculum,
    curriculum: legacyCurriculum,
    secondaryStreams: legacyStreams(school.secondarySections),
    classesOffered: [...new Set((school.secondarySections ?? []).flatMap((s) => s.classesOffered ?? []))],
    programs: allPrograms(school).map((p) => ({ ...p, level: legacyProgramLevel(p) })),
  };
}

export const schoolsRepository = {
  async findAll(filters = {}) {
    const where = {};
    if (filters.search) {
      const q = filters.search;
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { location: { is: { city: { contains: q, mode: "insensitive" } } } },
        { location: { is: { region: { contains: q, mode: "insensitive" } } } },
      ];
    }
    if (filters.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      const levels = cats.flatMap((c) => LEVEL_MAP[c] || []);
      if (levels.length) where.levels = { hasSome: levels };
    }
    if (filters.region) {
      const regions = Array.isArray(filters.region) ? filters.region : [filters.region];
      where.location = {
        is: { OR: regions.map((r) => ({ region: { equals: r, mode: "insensitive" } })) },
      };
    }
    if (filters.verified !== undefined) {
      where.verificationStatus = filters.verified ? "VERIFIED" : { not: "VERIFIED" };
    }
    if (filters.language) {
      const langs = (Array.isArray(filters.language) ? filters.language : [filters.language]).map(
        (l) => LANG_MAP[l] || toUpperEnum(l)
      );
      where.languages = { hasSome: langs };
    }
    if (filters.ownership) {
      const vals = Array.isArray(filters.ownership) ? filters.ownership : [filters.ownership];
      where.ownership = { in: vals.map(toUpperEnum) };
    }
    if (filters.boarding) {
      const vals = Array.isArray(filters.boarding) ? filters.boarding : [filters.boarding];
      where.boarding = { in: vals.map(toUpperEnum) };
    }
    if (filters.program) {
      where.programs = { some: { name: { contains: filters.program, mode: "insensitive" } } };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prismaClient.school.findMany({
        where,
        skip,
        take: limit,
        include: INCLUDE_RELS,
      }),
      prismaClient.school.count({ where }),
    ]);

    return { data: data.map(serializeSchool), total, page, limit };
  },

  async findById(id) {
    return serializeSchool(
      await prismaClient.school.findUnique({
        where: { id },
        include: INCLUDE_RELS,
      })
    );
  },

  async incrementViews(id) {
    return serializeSchool(
      await prismaClient.school.update({
        where: { id },
        data: { anonymousViews: { increment: 1 } },
        include: { programs: true },
      })
    );
  },

  async findNearby(latitude, longitude, radiusKm = 10) {
    // Try PostGIS first; fall back to Haversine if PostGIS is not available.
    // The geographic filtering AND distance calculation happen in PostGIS
    // (lon/lat order, geography cast); the full school rows (with relations)
    // are then fetched by id so the result carries the same data as a list row.
    try {
      const distanceRows = await prismaClient.$queryRaw`
        SELECT s.id,
          ST_Distance(
            ST_MakePoint(l.longitude, l.latitude)::geography,
            ST_MakePoint(${longitude}, ${latitude})::geography
          ) / 1000 as distance_km
        FROM "School" s
        JOIN "Location" l ON l.id = s."locationId"
        WHERE l.latitude IS NOT NULL AND l.longitude IS NOT NULL
          AND ST_DWithin(
            ST_MakePoint(l.longitude, l.latitude)::geography,
            ST_MakePoint(${longitude}, ${latitude})::geography,
            ${radiusKm * 1000}
          )
        ORDER BY distance_km ASC
      `;

      if (distanceRows.length === 0) return [];

      const distanceById = new Map(
        distanceRows.map((row) => [row.id, Number(row.distance_km)])
      );
      const schools = await prismaClient.school.findMany({
        where: { id: { in: distanceRows.map((row) => row.id) } },
        include: INCLUDE_RELS,
      });

      return schools
        .map((school) => {
          const distanceKm = distanceById.get(school.id) ?? null;
          return distanceKm === null ? null : attachDistance(serializeSchool(school), distanceKm);
        })
        .filter(Boolean);
    } catch (err) {
      // PostGIS not available — fall back to the centralized Haversine formula.
      const allSchools = await prismaClient.school.findMany({ include: INCLUDE_RELS });

      return allSchools
        .filter((school) => school.location?.latitude != null && school.location?.longitude != null)
        .map((school) => {
          const distanceKm = calculateDistanceKm(
            latitude,
            longitude,
            school.location.latitude,
            school.location.longitude
          );
          return { school, distanceKm };
        })
        .filter(({ distanceKm }) => distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .map(({ school, distanceKm }) => attachDistance(serializeSchool(school), distanceKm));
    }
  },
};
