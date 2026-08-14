/**
 * Canonical shared school types.
 *
 * `SchoolDetail` mirrors the shape returned by the public backend API
 * (see Backend/src/modules/schools/schoolsRepository.js `serializeSchool`).
 * It is the single source of truth for school-detail and home-page consumers.
 */

export interface SchoolProgram {
  id: string;
  name: string;
  level?: string;
  duration?: string;
  tuition?: number;
  description?: string;
}

export interface SchoolImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface SchoolDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  offersHighSchool?: boolean;
  city: string;
  region: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  website?: string;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  verified?: boolean;
  aiSummary?: string;
  anonymousViews?: number;
  annualFee?: number;
  ageRange?: string;
  studentTeacherRatio?: string;
  curriculum?: string;
  classesOffered?: string[];
  secondaryStreams?: string[];
  highSchoolPrograms?: string;
  programs?: SchoolProgram[];
  images?: SchoolImage[];
}
