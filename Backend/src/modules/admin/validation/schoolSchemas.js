import { z } from "zod";

const EDUCATION_LEVELS = ["NURSERY", "PRIMARY", "SECONDARY", "HIGHER"];
const SCHOOL_LANGUAGES = ["ENGLISH", "FRENCH", "BILINGUAL"];
const OWNERSHIP_TYPES = ["PUBLIC", "PRIVATE", "MISSION"];
const BOARDING_TYPES = ["DAY", "BOARDING", "BOTH"];
const VERIFICATION_STATUSES = ["PENDING", "VERIFIED", "REJECTED", "NEEDS_UPDATE"];
const IMAGE_USAGE_STATUSES = ["PENDING_REVIEW", "APPROVED", "REJECTED"];
const SOURCE_TYPES = [
  "OFFICIAL_GOVERNMENT",
  "OFFICIAL_SCHOOL_WEBSITE",
  "MANUAL_ENTRY",
  "PUBLIC_DIRECTORY",
  "AI_EXTRACTED",
];

const MAX_PAGE = 1000000;
const MAX_LIMIT = 50;

// Empty string becomes null so clearing a nullable field maps cleanly to NULL.
const nullableStringField = (max) =>
  z.preprocess(
    (value) => (value === "" ? null : value),
    z.union([z.string().trim().max(max), z.null()]).optional()
  );

// Strict http(s) URL validation. Rejects strings that merely *look* like URLs
// (e.g. "ht!tp://broken url") — the hostname must be a real domain or
// localhost, with no whitespace or illegal host characters.
const httpUrl = (message) =>
  z
    .string()
    .max(500)
    .refine(
      (value) => {
        let parsed;
        try {
          parsed = new URL(value);
        } catch {
          return false;
        }
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
        const host = parsed.hostname;
        if (!host || /\s/.test(host) || host.includes("!")) return false;
        return host === "localhost" || host.includes(".");
      },
      message
    );

// Website field: empty/null allowed (nullable column), bare domains are
// normalized to https://. Malformed URLs are rejected.
const websiteField = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    if (/\s/.test(raw)) return raw; // whitespace will be rejected by the refine
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return raw;
    return `https://${raw}`;
  },
  z.union([httpUrl("Please enter a valid website URL"), z.null()]).optional()
);

const nullableEmailField = z.preprocess(
  (value) => (value === "" ? null : value),
  z.union([z.string().trim().email("Please enter a valid email address").max(254), z.null()]).optional()
);

// Number fields that may be null and tolerate numeric strings from clients.
const nullableNumber = (min, max) =>
  z.preprocess(
    (value) => {
      if (value === null || value === undefined || value === "") return null;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
      }
      return value;
    },
    z.number().min(min, `Must be at least ${min}`).max(max, `Must be at most ${max}`).nullable().optional()
  );

const locationSchema = z.object({
  region: z.string().trim().min(1, "Region is required").max(100),
  division: nullableStringField(100),
  subdivision: nullableStringField(100),
  city: z.string().trim().min(1, "City is required").max(100),
  address: nullableStringField(255),
  latitude: nullableNumber(-90, 90),
  longitude: nullableNumber(-180, 180),
});

// Partial location for updates — every field optional so an administrator can
// change only the coordinates, only the city, etc.
const partialLocationSchema = z
  .object({
    region: z.string().trim().min(1, "Region is required").max(100),
    division: nullableStringField(100),
    subdivision: nullableStringField(100),
    city: z.string().trim().min(1, "City is required").max(100),
    address: nullableStringField(255),
    latitude: nullableNumber(-90, 90),
    longitude: nullableNumber(-180, 180),
  })
  .partial();

const baseSchoolSchema = z.object({
  name: z.string().trim().min(1, "School name is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  website: websiteField,
  contactEmail: nullableEmailField,
  contactPhone: nullableStringField(50),
  levels: z.array(z.enum(EDUCATION_LEVELS), { invalid_type_error: "Invalid education level" }).min(1, "At least one education level is required"),
  languages: z.array(z.enum(SCHOOL_LANGUAGES), { invalid_type_error: "Invalid language" }).optional(),
  ownership: z.enum(OWNERSHIP_TYPES).nullable().optional(),
  boarding: z.enum(BOARDING_TYPES).nullable().optional(),
  ageRange: nullableStringField(50),
  studentTeacherRatio: nullableStringField(20),
  annualFee: z.preprocess(
    (value) => (value === "" ? null : value),
    z.union([z.number().int("Annual fee must be a whole number").min(0).max(1000000000), z.null()]).optional()
  ),
  verificationStatus: z.enum(VERIFICATION_STATUSES).optional(),
  verificationNotes: nullableStringField(1000),
  location: locationSchema,
});

export const createSchoolSchema = baseSchoolSchema;

export const updateSchoolSchema = baseSchoolSchema.partial().extend({
  // Updating levels may submit a reduced (even empty) set of levels.
  levels: z.array(z.enum(EDUCATION_LEVELS)).optional(),
  // Location updates are partial — only submitted fields are changed.
  location: partialLocationSchema.optional(),
});

export const adminListSchoolsSchema = z.object({
  search: z.string().trim().max(200).optional(),
  category: z.enum(EDUCATION_LEVELS).optional(),
  region: z.string().trim().max(100).optional(),
  verificationStatus: z.enum(VERIFICATION_STATUSES).optional(),
  page: z.coerce.number().int().min(1).max(MAX_PAGE).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(20),
});

export const schoolIdSchema = z.object({
  id: z.string().min(1).max(100),
});

export const schoolImageIdSchema = z.object({
  id: z.string().min(1).max(100),
  imageId: z.string().min(1).max(100),
});

export const addImageSchema = z.object({
  url: httpUrl("Please enter a valid image URL"),
  caption: nullableStringField(255),
  altText: nullableStringField(255),
  isPrimary: z.boolean().optional(),
  order: z.coerce.number().int().min(0).optional(),
  sourceUrl: z.preprocess(
    (value) => (value === "" ? null : value),
    z.union([httpUrl("Please enter a valid source URL"), z.null()]).optional()
  ),
  sourceType: z.enum(SOURCE_TYPES).nullable().optional(),
  usageStatus: z.enum(IMAGE_USAGE_STATUSES).optional(),
});

export const changeVerificationSchema = z.object({
  verificationStatus: z.enum(VERIFICATION_STATUSES),
  verificationNotes: nullableStringField(1000),
});

export const updateImageSchema = z.object({
  caption: nullableStringField(255),
  altText: nullableStringField(255),
  isPrimary: z.boolean().optional(),
});
