import { prismaClient } from "../../../lib/database.js";

export const adminDashboardRepository = {
  countSchools() {
    return prismaClient.school.count();
  },

  countVerifiedSchools() {
    return prismaClient.school.count({ where: { verificationStatus: "VERIFIED" } });
  },

  countMissingCoordinates() {
    return prismaClient.school.count({
      where: {
        location: { OR: [{ latitude: null }, { longitude: null }] },
      },
    });
  },

  countMissingWebsite() {
    return prismaClient.school.count({ where: { website: null } });
  },

  countMissingImages() {
    return prismaClient.school.count({ where: { images: { none: {} } } });
  },

  countByLevel(level) {
    return prismaClient.school.count({ where: { levels: { has: level } } });
  },

  countPrimaryNursery() {
    return prismaClient.school.count({
      where: {
        OR: [{ levels: { has: "NURSERY" } }, { levels: { has: "PRIMARY" } }],
      },
    });
  },

  recentSchools(take = 10) {
    return prismaClient.school.findMany({
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        verificationStatus: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,
        levels: true,
        location: {
          select: {
            region: true,
            city: true,
          },
        },
        images: {
          select: { id: true, url: true, isPrimary: true },
          orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
          take: 1,
        },
      },
    });
  },
};
