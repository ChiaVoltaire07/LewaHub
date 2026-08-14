import { AppError } from "../../../middleware/errorHandler.js";
import { toAppError } from "../../../lib/prismaErrors.js";
import { logAudit } from "../../../lib/audit.js";
import { adminSchoolsRepository } from "./schoolsRepository.js";
import { invalidateSchoolCache } from "../cacheInvalidation.js";

const SCHOOL_FIELDS = [
  "name",
  "description",
  "website",
  "contactEmail",
  "contactPhone",
  "levels",
  "languages",
  "ownership",
  "boarding",
  "ageRange",
  "studentTeacherRatio",
  "annualFee",
  "verificationNotes",
];

const LOCATION_FIELDS = [
  "region",
  "division",
  "subdivision",
  "city",
  "address",
  "latitude",
  "longitude",
];

function toSchoolData(input) {
  const data = {};
  for (const field of SCHOOL_FIELDS) {
    if (field in input) data[field] = input[field] ?? null;
  }

  // Verification transitions set verifiedAt. Only fields explicitly submitted
  // are touched; verifiedAt is derived from the status change.
  if ("verificationStatus" in input) {
    data.verificationStatus = input.verificationStatus;
    if (input.verificationStatus === "VERIFIED") {
      data.verifiedAt = new Date();
    } else {
      // Moving away from VERIFIED clears verifiedAt (the school is no longer
      // verified). verificationNotes are preserved, never silently wiped.
      if (input.verificationStatus !== null) data.verifiedAt = null;
    }
  }

  return data;
}

function toLocationData(locationInput) {
  const data = {};
  for (const field of LOCATION_FIELDS) {
    if (field in locationInput) data[field] = locationInput[field] ?? null;
  }
  return data;
}

export const adminSchoolsService = {
  /**
   * Paginated, searchable, filterable school list.
   */
  async listSchools({ search, category, region, verificationStatus, page, limit }) {
    const [data, total] = await adminSchoolsRepository.findAll({
      search,
      category,
      region,
      verificationStatus,
      page,
      limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getSchoolById(id) {
    const school = await adminSchoolsRepository.findById(id);
    if (!school) {
      throw new AppError("School not found", 404, "SCHOOL_NOT_FOUND");
    }
    return school;
  },

  async createSchool(input) {
    const location = toLocationData(input.location);
    const schoolData = {
      ...toSchoolData(input),
      name: input.name,
      description: input.description,
      levels: input.levels,
      languages: input.languages ?? [],
      verificationStatus: input.verificationStatus ?? "PENDING",
    };
    if (schoolData.verificationStatus === "VERIFIED") schoolData.verifiedAt = new Date();

    try {
      const school = await adminSchoolsRepository.create({ schoolData, location });
      await invalidateSchoolCache(school.id);
      logAudit("admin.school.create", { schoolId: school.id, name: school.name });
      return school;
    } catch (error) {
      throw toAppError(error, "Unable to create the school.");
    }
  },

  async updateSchool(id, input) {
    const existing = await adminSchoolsRepository.findForMutation(id);
    if (!existing) {
      throw new AppError("School not found", 404, "SCHOOL_NOT_FOUND");
    }

    const schoolData = toSchoolData(input);
    const locationData = input.location ? toLocationData(input.location) : undefined;

    try {
      const school = await adminSchoolsRepository.update(id, { schoolData, locationData });
      await invalidateSchoolCache(id);
      logAudit("admin.school.update", { schoolId: id });
      return school;
    } catch (error) {
      throw toAppError(error, "Unable to update the school.");
    }
  },

  async deleteSchool(id) {
    const existing = await adminSchoolsRepository.findForMutation(id);
    if (!existing) {
      throw new AppError("School not found", 404, "SCHOOL_NOT_FOUND");
    }

    try {
      await adminSchoolsRepository.delete(id);
      await invalidateSchoolCache(id);
      logAudit("admin.school.delete", { schoolId: id });
      return { id, deleted: true };
    } catch (error) {
      throw toAppError(error, "Unable to delete the school.");
    }
  },

  async addImage(schoolId, input) {
    const school = await adminSchoolsRepository.findForMutation(schoolId);
    if (!school) {
      throw new AppError("School not found", 404, "SCHOOL_NOT_FOUND");
    }

    try {
      const imageCount = await adminSchoolsRepository.countImages(schoolId);
      const isPrimary = imageCount === 0 ? true : (input.isPrimary ?? false);
      const order = input.order ?? imageCount;

      const image = await adminSchoolsRepository.addImage(schoolId, {
        url: input.url,
        caption: input.caption ?? null,
        altText: input.altText ?? null,
        isPrimary,
        order,
        sourceUrl: input.sourceUrl ?? null,
        sourceType: input.sourceType ?? null,
        usageStatus: input.usageStatus ?? "PENDING_REVIEW",
      });

      if (isPrimary) {
        await adminSchoolsRepository.demoteOtherPrimary(schoolId, image.id);
      }

      await invalidateSchoolCache(schoolId);
      logAudit("admin.school.image_add", { schoolId, imageId: image.id });
      return image;
    } catch (error) {
      throw toAppError(error, "Unable to add the image.");
    }
  },

  async deleteImage(schoolId, imageId) {
    const school = await adminSchoolsRepository.findForMutation(schoolId);
    if (!school) {
      throw new AppError("School not found", 404, "SCHOOL_NOT_FOUND");
    }

    const image = await adminSchoolsRepository.findImage(schoolId, imageId);
    if (!image) {
      throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
    }

    try {
      await adminSchoolsRepository.deleteImage(imageId);

      // If the primary image was removed, promote the next one so the school
      // never ends up with a broken "no primary" state.
      if (image.isPrimary) {
        await adminSchoolsRepository.promoteFirstImage(schoolId, imageId);
      }

      await invalidateSchoolCache(schoolId);
      logAudit("admin.school.image_delete", { schoolId, imageId });
      return { id: imageId, deleted: true };
    } catch (error) {
      throw toAppError(error, "Unable to remove the image.");
    }
  },

  async updateImage(schoolId, imageId, input) {
    const school = await adminSchoolsRepository.findForMutation(schoolId);
    if (!school) {
      throw new AppError("School not found", 404, "SCHOOL_NOT_FOUND");
    }

    const image = await adminSchoolsRepository.findImage(schoolId, imageId);
    if (!image) {
      throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
    }

    try {
      const data = {};
      if ("caption" in input) data.caption = input.caption ?? null;
      if ("altText" in input) data.altText = input.altText ?? null;
      if ("isPrimary" in input) data.isPrimary = input.isPrimary;

      if (input.isPrimary === true) {
        // Promote this image and demote every other primary.
        await adminSchoolsRepository.demoteOtherPrimary(schoolId, imageId);
      }

      const updated = await adminSchoolsRepository.updateImage(imageId, data);

      if (input.isPrimary === false) {
        // Unsetting primary demotes this image; if no other image is primary,
        // promote the next one so the school keeps a primary image.
        await adminSchoolsRepository.promoteFirstImage(schoolId, imageId);
      }

      await invalidateSchoolCache(schoolId);
      logAudit("admin.school.image_update", { schoolId, imageId });
      return updated;
    } catch (error) {
      throw toAppError(error, "Unable to update the image.");
    }
  },
};
