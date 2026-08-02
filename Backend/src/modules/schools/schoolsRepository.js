// Repository layer - direct database access
// Supports both in-memory (current) and Prisma/PostgreSQL (when configured)

import { usePrisma, prismaClient } from "../../lib/database.js";

// In-memory storage (fallback)
let schools = [
  {
    id: "school-1",
    name: "University of Yaoundé I",
    category: "University",
    offersHighSchool: false,
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
    aiSummary: "University of Yaoundé I is Cameroon's premier higher education establishment, offering a wide range of programs across multiple faculties. Known for its strong research output and central location in the capital.",
    programs: [
      { id: "prog-1", name: "Computer Science", level: "Bachelor", duration: "3 years", tuition: 250000 },
      { id: "prog-2", name: "Medicine", level: "Doctorate", duration: "7 years", tuition: 500000 },
    ],
    anonymousViews: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const schoolsRepository = {
  async findAll(filters = {}) {
    if (usePrisma && prismaClient) {
      return this._prismaFindAll(filters);
    }
    return this._inMemoryFindAll(filters);
  },

  async _inMemoryFindAll(filters = {}) {
    let result = [...schools];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter((s) => s.category === filters.category);
    }

    if (filters.offersHighSchool !== undefined) {
      result = result.filter((s) => s.offersHighSchool === filters.offersHighSchool);
    }

    if (filters.region) {
      result = result.filter((s) => s.region === filters.region);
    }

    if (filters.verified !== undefined) {
      result = result.filter((s) => s.verified === filters.verified);
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
      if (filters.category) where.category = filters.category;
      if (filters.offersHighSchool !== undefined) where.offersHighSchool = filters.offersHighSchool;
      if (filters.region) where.region = filters.region;
      if (filters.verified !== undefined) where.verified = filters.verified;

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        prismaClient.school.findMany({
          where,
          skip,
          take: limit,
          include: { programs: true },
        }),
        prismaClient.school.count({ where }),
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
        return await prismaClient.school.findUnique({
          where: { id },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma query failed:", err.message);
      }
    }
    return schools.find((s) => s.id === id);
  },

  async create(data) {
    if (usePrisma && prismaClient) {
      try {
        const { programs, ...schoolData } = data;
        return await prismaClient.school.create({
          data: {
            ...schoolData,
            programs: programs ? { create: programs } : undefined,
          },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma create failed:", err.message);
      }
    }

    const newSchool = {
      id: `school-${Date.now()}`,
      ...data,
      programs: data.programs || [],
      anonymousViews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    schools.push(newSchool);
    return newSchool;
  },

  async update(id, data) {
    if (usePrisma && prismaClient) {
      try {
        const { programs, ...schoolData } = data;
        return await prismaClient.school.update({
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
          },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma update failed:", err.message);
      }
    }

    const idx = schools.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    schools[idx] = {
      ...schools[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    return schools[idx];
  },

  async delete(id) {
    if (usePrisma && prismaClient) {
      try {
        await prismaClient.school.delete({ where: { id } });
        return true;
      } catch (err) {
        console.error("Prisma delete failed:", err.message);
      }
    }

    const idx = schools.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    schools.splice(idx, 1);
    return true;
  },

  async incrementViews(id) {
    if (usePrisma && prismaClient) {
      try {
        return await prismaClient.school.update({
          where: { id },
          data: { anonymousViews: { increment: 1 } },
          include: { programs: true },
        });
      } catch (err) {
        console.error("Prisma increment failed:", err.message);
      }
    }

    const school = schools.find((s) => s.id === id);
    if (school) {
      school.anonymousViews = (school.anonymousViews || 0) + 1;
    }
    return school;
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
        console.error("PostGIS query failed, using in-memory:", err.message);
      }
    }

    // Fallback: Haversine formula
    const toRad = (deg) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const nearby = schools
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
        const distance = earthRadiusKm * c;
        return { ...school, distance };
      })
      .filter((school) => school.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return nearby;
  },
};