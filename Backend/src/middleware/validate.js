import { z } from "zod";

// ============ School Schemas ============

const programSchema = z.object({
  name: z.string().min(1, "Program name is required").max(200),
  level: z.string().min(1, "Program level is required").max(100),
  duration: z.string().min(1, "Program duration is required").max(100),
  tuition: z.number().int().nonnegative().optional(),
  description: z.string().max(2000).optional(),
});

const schoolImageSchema = z.object({
  url: z.string().url("Image URL must be valid"),
  caption: z.string().max(300).optional().nullable(),
  order: z.number().int().nonnegative().optional(),
});

const schoolBaseSchema = {
  name: z.string().min(1, "School name is required").max(200),
  category: z.enum(["PrimaryNursery", "Secondary", "University"], {
    errorMap: () => ({ message: "Category must be PrimaryNursery, Secondary, or University" }),
  }),
  offersHighSchool: z.boolean().optional().default(false),
  secondaryStreams: z
    .array(z.enum(["General", "Technical", "Commercial"]))
    .optional()
    .default([]),
  ageRange: z.string().max(50).optional().nullable(),
  studentTeacherRatio: z.string().max(50).optional().nullable(),
  curriculum: z.string().max(50).optional().nullable(),
  annualFee: z.number().int().nonnegative().optional().nullable(),
  classesOffered: z.array(z.string().max(50)).optional().default([]),
  programType: z.string().max(50).optional().nullable(),
  highSchoolPrograms: z.string().max(2000).optional().nullable(),
  description: z.string().min(1, "Description is required").max(5000),
  region: z.string().min(1, "Region is required").max(100),
  city: z.string().min(1, "City is required").max(100),
  address: z.string().min(1, "Address is required").max(300),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  website: z.string().url().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(50).optional().nullable(),
  language: z.enum(["Anglophone", "Francophone", "Bilingual"]).optional().nullable(),
  ownership: z.enum(["Public", "Private", "Mission"]).optional().nullable(),
  boarding: z.enum(["Day", "Boarding", "Both"]).optional().nullable(),
  verified: z.boolean().optional().default(false),
  aiSummary: z.string().max(5000).optional().nullable(),
  anonymousViews: z.number().int().nonnegative().optional(),
  programs: z.array(programSchema).optional(),
  images: z.array(schoolImageSchema).optional(),
};

export const createSchoolSchema = z.object(schoolBaseSchema).strict();

export const updateSchoolSchema = z.object(schoolBaseSchema).partial().strip();

// ============ Program Schemas ============

export const createProgramSchema = z
  .object({
    name: z.string().min(1, "Program name is required").max(200),
    level: z.string().min(1, "Program level is required").max(100),
    duration: z.string().min(1, "Program duration is required").max(100),
    tuition: z.number().int().nonnegative().optional(),
    description: z.string().max(2000).optional(),
  })
  .strict();

export const updateProgramSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    level: z.string().min(1).max(100).optional(),
    duration: z.string().min(1).max(100).optional(),
    tuition: z.number().int().nonnegative().optional(),
    description: z.string().max(2000).optional(),
  })
  .strict();

// ============ Auth Schemas ============

export const loginSchema = z
  .object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(10, "New password must be at least 10 characters"),
  })
  .strict();

// ============ Validation Middleware ============

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return res.status(400).json({
      error: firstError?.message || "Invalid request body",
      details: result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  // Replace req.body with the validated, whitelisted data
  req.body = result.data;
  next();
};