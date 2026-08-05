// Repository layer - direct database access
// Uses Prisma/PostgreSQL exclusively (no in-memory fallback)

import { prismaClient } from "../../lib/database.js";

export const schoolsRepository = {
  async findAll(filters = {}) {
    const where = {};
    if (filters.search) {
      const q = filters.search;
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { region: { contains: q, mode: "insensitive" } },
      ];
    }
    if (filters.category) {
      where.category = Array.isArray(filters.category)
        ? { in: filters.category }
        : filters.category;
    }
    if (filters.offersHighSchool !== undefined) where.offersHighSchool = filters.offersHighSchool;
    if (filters.region) {
      where.region = Array.isArray(filters.region)
        ? { in: filters.region }
        : filters.region;
    }
    if (filters.verified !== undefined) where.verified = filters.verified;
    if (filters.language) {
      where.language = Array.isArray(filters.language)
        ? { in: filters.language }
        : filters.language;
    }
    if (filters.ownership) {
      where.ownership = Array.isArray(filters.ownership)
        ? { in: filters.ownership }
        : filters.ownership;
    }
    if (filters.boarding) {
      where.boarding = Array.isArray(filters.boarding)
        ? { in: filters.boarding }
        : filters.boarding;
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
        include: { programs: true, images: { orderBy: { order: "asc" } } },
      }),
      prismaClient.school.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async findById(id) {
    return prismaClient.school.findUnique({
      where: { id },
      include: { programs: true, images: { orderBy: { order: "asc" } } },
    });
  },

  async create(data) {
    const { programs, images, ...schoolData } = data;
    return prismaClient.school.create({
      data: {
        ...schoolData,
        programs: programs ? { create: programs } : undefined,
        images: images ? { create: images } : undefined,
      },
      include: { programs: true, images: { orderBy: { order: "asc" } } },
    });
  },

  async update(id, data) {
    const { programs, images, ...schoolData } = data;
    return prismaClient.school.update({
      where: { id },
      data: {
        ...schoolData,
        programs: programs
          ? {
              deleteMany: {},
              create: programs.map((p) => ({
                name: p.name,
                level: p.level,
                duration: p.duration,
                tuition: p.tuition,
                description: p.description,
              })),
            }
          : undefined,
        images: images
          ? {
              deleteMany: {},
              create: images.map((img, idx) => ({
                url: img.url,
                caption: img.caption,
                order: img.order ?? idx,
              })),
            }
          : undefined,
      },
      include: { programs: true, images: { orderBy: { order: "asc" } } },
    });
  },

  async delete(id) {
    await prismaClient.school.delete({ where: { id } });
    return true;
  },

  async incrementViews(id) {
    return prismaClient.school.update({
      where: { id },
      data: { anonymousViews: { increment: 1 } },
      include: { programs: true },
    });
  },

  async findNearby(latitude, longitude, radiusKm = 50) {
    // Try PostGIS first; fall back to Haversine if PostGIS is not available
    try {
      const nearby = await prismaClient.$queryRaw`
        SELECT *, 
          ST_Distance(
            ST_MakePoint(longitude, latitude)::geography,
            ST_MakePoint(${longitude}, ${latitude})::geography
          ) / 1000 as distance_km
        FROM "School"
        WHERE ST_DWithin(
          ST_MakePoint(longitude, latitude)::geography,
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ${radiusKm * 1000}
        )
        ORDER BY distance_km ASC
      `;
      return nearby;
    } catch (err) {
      // PostGIS not available — fall back to Haversine formula in JS
      const allSchools = await prismaClient.school.findMany();
      const R = 6371; // Earth radius in km
      const toRad = (deg) => (deg * Math.PI) / 180;

      return allSchools
        .map((school) => {
          const dLat = toRad(school.latitude - latitude);
          const dLon = toRad(school.longitude - longitude);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(latitude)) *
              Math.cos(toRad(school.latitude)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distanceKm = R * c;
          return { ...school, distance_km: distanceKm };
        })
        .filter((school) => school.distance_km <= radiusKm)
        .sort((a, b) => a.distance_km - b.distance_km);
    }
  },
};