import { prismaClient } from "../../../lib/database.js";

// Full school payload used by create/update responses and admin detail view.
const DETAIL_INCLUDE = {
  location: true,
  images: {
    orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
  },
  fees: {
    orderBy: { academicYear: "desc" },
  },
  facilities: { include: { facility: true } },
  qualifications: { include: { qualification: true } },
  secondarySections: true,
  faculties: {
    include: {
      departments: {
        include: {
          programs: { include: { qualification: true } },
        },
      },
    },
  },
  programs: { include: { qualification: true } },
  sources: { orderBy: { createdAt: "desc" } },
  identifiers: true,
};

// Compact row used by the paginated list view.
const LIST_SELECT = {
  id: true,
  name: true,
  description: true,
  levels: true,
  languages: true,
  ownership: true,
  boarding: true,
  website: true,
  contactEmail: true,
  contactPhone: true,
  verificationStatus: true,
  verifiedAt: true,
  annualFee: true,
  createdAt: true,
  updatedAt: true,
  location: {
    select: { region: true, division: true, subdivision: true, city: true, address: true },
  },
  images: {
    select: { id: true, url: true, isPrimary: true },
    orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
    take: 1,
  },
};

export const adminSchoolsRepository = {
  findAll({ search, category, region, verificationStatus, page, limit }) {
    const where = {};

    if (search) {
      const q = search;
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { location: { is: { city: { contains: q, mode: "insensitive" } } } },
        { location: { is: { region: { contains: q, mode: "insensitive" } } } },
      ];
    }

    if (category) {
      where.levels = { has: category };
    }

    if (region) {
      where.location = {
        is: { region: { contains: region, mode: "insensitive" } },
      };
    }

    if (verificationStatus) {
      where.verificationStatus = verificationStatus;
    }

    const skip = (page - 1) * limit;

    return Promise.all([
      prismaClient.school.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: LIST_SELECT,
      }),
      prismaClient.school.count({ where }),
    ]);
  },

  findById(id) {
    return prismaClient.school.findUnique({
      where: { id },
      include: DETAIL_INCLUDE,
    });
  },

  findForMutation(id) {
    return prismaClient.school.findUnique({
      where: { id },
      select: { id: true, locationId: true, verificationStatus: true },
    });
  },

  /**
   * Create a school together with its location atomically. If the location
   * already exists (identical region/division/subdivision/city/address) it is
   * reused rather than duplicated.
   */
  async create({ schoolData, location }) {
    return prismaClient.$transaction(async (tx) => {
      const existing = await tx.location.findFirst({
        where: {
          region: location.region,
          division: location.division ?? null,
          subdivision: location.subdivision ?? null,
          city: location.city,
          address: location.address ?? null,
        },
      });

      const locationId =
        existing?.id ??
        (
          await tx.location.create({
            data: {
              region: location.region,
              division: location.division ?? null,
              subdivision: location.subdivision ?? null,
              city: location.city,
              address: location.address ?? null,
              latitude: location.latitude ?? null,
              longitude: location.longitude ?? null,
            },
          })
        ).id;

      return tx.school.create({
        data: { ...schoolData, locationId },
        include: DETAIL_INCLUDE,
      });
    });
  },

  /**
   * Update school scalar fields and (optionally) its location in place.
   * Only fields explicitly provided by the administrator are changed.
   */
  update(id, { schoolData, locationData }) {
    return prismaClient.$transaction(async (tx) => {
      const existing = await tx.school.findUnique({
        where: { id },
        select: { id: true, locationId: true },
      });
      if (!existing) return null;

      if (locationData && Object.keys(locationData).length > 0) {
        await tx.location.update({
          where: { id: existing.locationId },
          data: locationData,
        });
      }

      return tx.school.update({
        where: { id },
        data: schoolData,
        include: DETAIL_INCLUDE,
      });
    });
  },

  delete(id) {
    // The schema cascades SchoolImage, SchoolFee, SchoolFacility,
    // SchoolQualification, SchoolSource, InstitutionIdentifier, sections,
    // faculties, departments and programs; SchoolDataCandidate.matchedSchool
    // is SET NULL. Only the shared Location row is retained (Restrict).
    return prismaClient.school.delete({ where: { id } });
  },

  countImages(schoolId) {
    return prismaClient.schoolImage.count({ where: { schoolId } });
  },

  findImage(schoolId, imageId) {
    return prismaClient.schoolImage.findFirst({
      where: { id: imageId, schoolId },
    });
  },

  addImage(schoolId, data) {
    return prismaClient.schoolImage.create({
      data: { ...data, schoolId },
    });
  },

  demoteOtherPrimary(schoolId, keepImageId) {
    return prismaClient.schoolImage.updateMany({
      where: { schoolId, isPrimary: true, id: { not: keepImageId } },
      data: { isPrimary: false },
    });
  },

  async promoteFirstImage(schoolId, excludeImageId) {
    const next = await prismaClient.schoolImage.findFirst({
      where: { schoolId, id: { not: excludeImageId } },
      orderBy: { order: "asc" },
      select: { id: true },
    });
    if (next) {
      await prismaClient.schoolImage.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  },

  deleteImage(imageId) {
    return prismaClient.schoolImage.delete({ where: { id: imageId } });
  },

  updateImage(imageId, data) {
    return prismaClient.schoolImage.update({ where: { id: imageId }, data });
  },
};
