// Query parameter validation for public endpoints.
// All query params are validated before they reach controllers/services so
// that NaN / out-of-range / oversized values never reach Prisma or produce 500s.
import { z } from "zod";

const MAX_LIMIT = 100;
const MAX_PAGE = 1000000;

const positiveInt = (max) =>
  z.coerce
    .number()
    .int()
    .min(1)
    .max(max);

// Comma-separated multi-value params (e.g. ?category=Secondary,University)
// become string arrays. Empty results normalize to undefined.
const csvString = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

const multiValue = z
  .union([csvString, z.array(z.string())])
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

// GET /api/v1/schools
export const listSchoolsSchema = z.object({
  search: z.string().trim().max(200).optional(),
  category: multiValue,
  region: multiValue,
  language: multiValue,
  ownership: multiValue,
  boarding: multiValue,
  program: z.string().trim().max(200).optional(),
  verified: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  page: positiveInt(MAX_PAGE).default(1),
  limit: positiveInt(MAX_LIMIT).default(10),
});

// GET /api/v1/schools/nearby
// radius is in kilometers. zod's number type rejects NaN and ±Infinity by
// default, so non-finite coordinates can never reach Prisma/PostGIS.
export const nearbySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().min(0.1).max(100).default(10),
  page: positiveInt(MAX_PAGE).default(1),
  limit: positiveInt(MAX_LIMIT).default(20),
});

// GET /api/v1/search
export const searchSchema = z.object({
  q: z.string().trim().min(2).max(200),
  category: z.string().trim().max(50).optional(),
  region: z.string().trim().max(100).optional(),
  page: positiveInt(MAX_PAGE).default(1),
  limit: positiveInt(MAX_LIMIT).default(10),
});

// Express middleware: parses req.query against `schema` and, on success,
// stores the validated/coerced result in req.validatedQuery.
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const issue = result.error.issues[0];
      const field = issue?.path?.length ? issue.path.join(".") : "query";
      const detail = issue?.message ? ` (${issue.message})` : "";
      return res.status(400).json({ error: `Invalid query parameter "${field}"${detail}` });
    }
    req.validatedQuery = result.data;
    return next();
  };
}
