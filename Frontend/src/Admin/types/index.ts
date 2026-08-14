/**
 * Admin authentication types
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  admin: AdminUser;
  expiresAt: string;
}

/**
 * Admin API result — a discriminated union so callers can tell success and
 * failure apart without guessing.
 */
export interface AdminApiSuccess<T> {
  ok: true;
  data: T;
  message?: string;
  /** The full unmodified response body (the unwrapped payload is in `data`). */
  raw?: Record<string, any>;
}

export interface AdminApiFailure {
  ok: false;
  error: string;
  status: number;
  code?: string;
}

export type AdminApiResult<T> = AdminApiSuccess<T> | AdminApiFailure;

/**
 * Admin dashboard types (backend: GET /admin/dashboard)
 */
export interface DashboardStats {
  totalSchools: number;
  universities: number;
  secondarySchools: number;
  primarySchools: number;
  verifiedSchools: number;
  missingCoordinates: number;
  missingWebsite: number;
  missingImages: number;
  recentSchools: RecentSchool[];
}

export interface RecentSchool {
  id: string;
  name: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  levels: EducationLevel[];
  location: {
    region: string;
    city: string;
  };
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

/**
 * Admin school types
 */
export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  NEEDS_UPDATE = "NEEDS_UPDATE",
}

export enum EducationLevel {
  NURSERY = "NURSERY",
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  HIGHER = "HIGHER",
}

export enum SchoolLanguage {
  ENGLISH = "ENGLISH",
  FRENCH = "FRENCH",
  BILINGUAL = "BILINGUAL",
}

export enum OwnershipType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  MISSION = "MISSION",
}

export enum BoardingType {
  DAY = "DAY",
  BOARDING = "BOARDING",
  BOTH = "BOTH",
}

export enum ImageUsageStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum SourceType {
  OFFICIAL_GOVERNMENT = "OFFICIAL_GOVERNMENT",
  OFFICIAL_SCHOOL_WEBSITE = "OFFICIAL_SCHOOL_WEBSITE",
  MANUAL_ENTRY = "MANUAL_ENTRY",
  PUBLIC_DIRECTORY = "PUBLIC_DIRECTORY",
  AI_EXTRACTED = "AI_EXTRACTED",
}

export interface SchoolLocation {
  id: string;
  region: string;
  division: string | null;
  subdivision: string | null;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Row shape returned by the paginated list endpoint. */
export interface AdminSchoolListItem {
  id: string;
  name: string;
  description: string;
  levels: EducationLevel[];
  languages: SchoolLanguage[];
  ownership: OwnershipType | null;
  boarding: BoardingType | null;
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  annualFee: number | null;
  createdAt: string;
  updatedAt: string;
  location: {
    region: string;
    division: string | null;
    subdivision: string | null;
    city: string;
    address: string | null;
  };
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

/** Paginated list response envelope (backend returns flat pagination fields). */
export interface PaginatedSchools {
  data: AdminSchoolListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SchoolImage {
  id: string;
  schoolId: string;
  url: string;
  storageKey: string | null;
  caption: string | null;
  altText: string | null;
  isPrimary: boolean;
  order: number;
  sourceUrl: string | null;
  sourceType: SourceType | null;
  usageStatus: ImageUsageStatus;
  createdAt: string;
}

export interface SchoolFee {
  id: string;
  academicYear: string;
  amount: number;
  currency: string;
  category: string | null;
}

export interface SchoolFacility {
  schoolId: string;
  facilityId: string;
  facility: { id: string; name: string; description: string | null; icon: string | null };
}

export interface SchoolSource {
  id: string;
  sourceType: SourceType;
  sourceName: string | null;
  sourceUrl: string | null;
  retrievedAt: string | null;
  verifiedAt: string | null;
  confidence: number | null;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
}

export interface InstitutionIdentifier {
  id: string;
  type: string;
  value: string;
  issuingAuthority: string | null;
  verified: boolean;
}

export interface SchoolQualification {
  id: string;
  qualification: {
    id: string;
    name: string;
    type: string;
    field: string | null;
    description: string | null;
  };
}

export interface SchoolSection {
  id: string;
  section: "GENERAL" | "TECHNICAL";
  track: string | null;
  classesOffered: string[];
}

export interface FacultyDepartmentProgram {
  id: string;
  name: string;
  duration: string | null;
  tuition: number | null;
  qualification: { id: string; name: string };
}

export interface FacultyDepartment {
  id: string;
  name: string;
  programs: FacultyDepartmentProgram[];
}

export interface Faculty {
  id: string;
  name: string;
  departments: FacultyDepartment[];
}

export interface SchoolProgram {
  id: string;
  name: string;
  duration: string | null;
  tuition: number | null;
  qualification: { id: string; name: string };
}

/** Full school detail returned by GET /admin/schools/:id (and mutations). */
export interface AdminSchoolDetail {
  id: string;
  name: string;
  description: string;
  locationId: string;
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  levels: EducationLevel[];
  languages: SchoolLanguage[];
  ownership: OwnershipType | null;
  boarding: BoardingType | null;
  ageRange: string | null;
  studentTeacherRatio: string | null;
  annualFee: number | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  verificationNotes: string | null;
  aiSummary: string | null;
  anonymousViews: number;
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
  location: SchoolLocation;
  images: SchoolImage[];
  fees: SchoolFee[];
  facilities: SchoolFacility[];
  qualifications: SchoolQualification[];
  secondarySections: SchoolSection[];
  faculties: Faculty[];
  programs: SchoolProgram[];
  sources: SchoolSource[];
  identifiers: InstitutionIdentifier[];
}

/** Payload sent to create/update a school. */
export interface AdminSchoolInput {
  name: string;
  description: string;
  website?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  levels: EducationLevel[];
  languages?: SchoolLanguage[];
  ownership?: OwnershipType | null;
  boarding?: BoardingType | null;
  ageRange?: string | null;
  studentTeacherRatio?: string | null;
  annualFee?: number | null;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string | null;
  location: {
    region: string;
    division?: string | null;
    subdivision?: string | null;
    city: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}

export interface SchoolFilters {
  search?: string;
  category?: string;
  region?: string;
  verificationStatus?: string;
  page?: number;
  limit?: number;
}

export interface AddImageInput {
  url: string;
  caption?: string | null;
  altText?: string | null;
  isPrimary?: boolean;
  order?: number;
  sourceUrl?: string | null;
  sourceType?: SourceType | null;
  usageStatus?: ImageUsageStatus;
}

export interface UpdateImageInput {
  caption?: string | null;
  altText?: string | null;
  isPrimary?: boolean;
}
