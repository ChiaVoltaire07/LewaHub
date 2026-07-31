// Repository layer - direct database access
// Supports both in-memory (current) and Prisma/PostgreSQL (when configured)

import { usePrisma, prismaClient } from "../../lib/database.js";

// In-memory storage (fallback)
let institutions = [
  {
    id: "inst-1",
    name: "University of Yaoundé I",
    type: "University",
    description: "The oldest and largest university in Cameroon, located in the capital city.",
    region: "Centre",
    city: "Yaoundé",
    address: "Avenue Kennedy, Ngoa-Ekellé",
    latitude: 3.848,
    longitude: 11.502,
    website: "https://www.uy1.uninet.cm",
    contactEmail: "info@uy1.uninet.cm",
    contactPhone: "+237 222 22 22 22",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
    aiSummary: "University of Yaoundé I is Cameroon's premier higher education institution, offering a wide range of programs across multiple faculties. Known for its strong research output and central location in the capital.",
    programs: [
      { id: "prog-1", name: "Computer Science", level: "Bachelor", duration: "3 years", tuition: 250000 },
      { id: "prog-2", name: "Medicine", level: "Doctorate", duration: "7 years", tuition: 500000 },
    ],
    anonymousViews: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const institutionsRepository = {
  async findAll(filters = {}) {
    if (usePrisma && prismaClient) {
      return this._prismaFindAll(filters);
    }
    return this._inMemoryFindAll(filters);
  },

  async _inMemoryFindAll(filters = {}) {
    let result = [...institutions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q) ||
          i.region.toLowerCase().includes(q)
      );
    }

    if (filters.type) {
      result = result.filter((i) => i.type === filters.type);
    }

    if (filters.region) {
      result = result.filter((i) => i.region === filters.region);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const total = result.length;
    const paginatedResult = result.slice(start, start + limit);

    return { data: paginatedResult, total, page, limit };
  },

  async _prismaFindAll(filters = {}) {
    try {
      const where = {};
      if (filters.search) {
        const q = filters.search;
        where.OR = [
          { name: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { region: { contains: q, mode: "insensitive" } },
        ];
      }
      if (filters.type) where.type = filters.type;
      if (filters.region) where.region = filters.region;

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        prismaClient.institution.findMany({
          where,
          skip,
          take: limit,
          include: { programs: true },
        }),
        prismaClient.institution.count({ where }),
      ]);

      return { data, total, page, limit };
    } catch (err) {
      console.error("Prisma query failed, falling back to in-memory:", err.message);
      return this._inMemoryFindAll(filters);
    }
  },

  async findById(id) {
    if (usePrisma && prismaClient) {
      try {
        return await prismaClient.institution.findUnique({
          where: { id },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma query failed:", err.message);
      }
    }
    return institutions.find((i) => i.id === id);
  },

  async create(data) {
    if (usePrisma && prismaClient) {
      try {
        const { programs, ...instData } = data;
        return await prismaClient.institution.create({
          data: {
            ...instData,
            programs: programs ? { create: programs } : undefined,
          },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma create failed:", err.message);
      }
    }

    const newInst = {
      id: `inst-${Date.now()}`,
      ...data,
      programs: data.programs || [],
      anonymousViews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    institutions.push(newInst);
    return newInst;
  },

  async update(id, data) {
    if (usePrisma && prismaClient) {
      try {
        const { programs, ...instData } = data;
        return await prismaClient.institution.update({
          where: { id },
          data: {
            ...instData,
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
          },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma update failed:", err.message);
      }
    }

    const idx = institutions.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    institutions[idx] = {
      ...institutions[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    return institutions[idx];
  },

  async delete(id) {
    if (usePrisma && prismaClient) {
      try {
        await prismaClient.institution.delete({ where: { id } });
        return true;
      } catch (err) {
        console.error("Prisma delete failed:", err.message);
      }
    }

    const idx = institutions.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    institutions.splice(idx, 1);
    return true;
  },

  async incrementViews(id) {
    if (usePrisma && prismaClient) {
      try {
        return await prismaClient.institution.update({
          where: { id },
          data: { anonymousViews: { increment: 1 } },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma increment failed:", err.message);
      }
    }

    const inst = institutions.find((i) => i.id === id);
    if (inst) {
      inst.anonymousViews = (inst.anonymousViews || 0) + 1;
    }
    return inst;
  },

  async findNearby(latitude, longitude, radiusKm = 50) {
    if (usePrisma && prismaClient) {
      try {
        // Use Prisma's raw query for PostGIS
        const nearby = await prismaClient.$queryRaw`
          SELECT *, 
            ST_Distance(
              ST_MakePoint(longitude, latitude)::geography,
              ST_MakePoint(${longitude}, ${latitude})::geography
            ) / 1000 as distance_km
          FROM "Institution"
          WHERE ST_DWithin(
            ST_MakePoint(longitude, latitude)::geography,
            ST_MakePoint(${longitude}, ${latitude})::geography,
            ${radiusKm * 1000}
          )
          ORDER BY distance_km ASC
        `;
        return nearby;
      } catch (err) {
        console.error("PostGIS query failed, using in-memory:", err.message);
      }
    }

    // Fallback: Haversine formula
    const toRad = (deg) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const nearby = institutions
      .map((inst) => {
        const dLat = toRad(inst.latitude - latitude);
        const dLon = toRad(inst.longitude - longitude);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(latitude)) *
            Math.cos(toRad(inst.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c;
        return { ...inst, distance };
      })
      .filter((inst) => inst.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return nearby;
  },
};
