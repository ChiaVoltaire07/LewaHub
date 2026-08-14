import { adminSchoolsService } from "./schoolsService.js";

export const adminSchoolsController = {
  /**
   * GET /api/v1/admin/schools?page=&limit=&search=&category=&region=&verificationStatus=
   */
  async listSchools(req, res, next) {
    try {
      const result = await adminSchoolsService.listSchools(req.validatedQuery);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/admin/schools/:id
   */
  async getSchoolById(req, res, next) {
    try {
      const school = await adminSchoolsService.getSchoolById(req.validatedParams.id);
      return res.json({ data: school });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/admin/schools
   */
  async createSchool(req, res, next) {
    try {
      const school = await adminSchoolsService.createSchool(req.validatedBody);
      return res.status(201).json({ data: school, message: "School created successfully." });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/v1/admin/schools/:id
   */
  async updateSchool(req, res, next) {
    try {
      const school = await adminSchoolsService.updateSchool(
        req.validatedParams.id,
        req.validatedBody
      );
      return res.json({ data: school, message: "School updated successfully." });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/admin/schools/:id
   */
  async deleteSchool(req, res, next) {
    try {
      const result = await adminSchoolsService.deleteSchool(req.validatedParams.id);
      return res.json({ data: result, message: "School deleted successfully." });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/admin/schools/:id/images
   */
  async addImage(req, res, next) {
    try {
      const image = await adminSchoolsService.addImage(
        req.validatedParams.id,
        req.validatedBody
      );
      return res.status(201).json({ data: image, message: "Image added successfully." });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/admin/schools/:id/images/:imageId
   */
  async deleteImage(req, res, next) {
    try {
      const result = await adminSchoolsService.deleteImage(
        req.validatedParams.id,
        req.validatedParams.imageId
      );
      return res.json({ data: result, message: "Image removed successfully." });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/v1/admin/schools/:id/images/:imageId
   */
  async updateImage(req, res, next) {
    try {
      const image = await adminSchoolsService.updateImage(
        req.validatedParams.id,
        req.validatedParams.imageId,
        req.validatedBody
      );
      return res.json({ data: image, message: "Image updated successfully." });
    } catch (error) {
      next(error);
    }
  },
};
