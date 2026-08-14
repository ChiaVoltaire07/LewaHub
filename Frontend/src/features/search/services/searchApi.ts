import { School, Filters } from '../types';
import api from '../../../lib/api';

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const normalizeSchoolArray = (payload: any): any[] => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

/** Maps a backend school row to the frontend School shape. Pure and unit-testable. */
export const mapBackendSchool = (school: any): School => ({
  id: school.id,
  name: school.name,
  region: school.region,
  category: school.category,
  offersHighSchool: school.offersHighSchool || false,
  curriculum: school.programs?.map((p: any) => p.level) || [],
  degreeLevel: school.programs?.map((p: any) => p.level) || [],
  programs: school.programs?.map((p: any) => p.name) || [],
  verified: school.verified || false,
  image: school.imageUrl || school.logo || DEFAULT_SCHOOL_IMAGE,
  location: {
    // null when the school has no coordinates — consumers must handle this
    lat: typeof school.latitude === "number" ? school.latitude : null,
    lng: typeof school.longitude === "number" ? school.longitude : null,
    address: school.address || school.city || '',
  },
  description: school.description || '',
});

export const searchSchools = async (filters: Filters): Promise<School[]> => {
  try {
    // Fetch from backend with applied filters
    // Backend supports comma-separated multi-values for region/category/language/ownership/boarding
    const response = await api.getSchools({
      search: filters.searchQuery || undefined,
      region: filters.region.length > 0 ? filters.region.join(',') : undefined,
      category: filters.category.length > 0 ? filters.category.join(',') : undefined,
      language: filters.language?.length ? filters.language.join(',') : undefined,
      ownership: filters.ownership?.length ? filters.ownership.join(',') : undefined,
      boarding: filters.boarding?.length ? filters.boarding.join(',') : undefined,
      program: filters.programs?.length ? filters.programs[0] : undefined,
      speciality: filters.specialities?.length ? filters.specialities[0] : undefined,
      verified: filters.verified ? 'true' : undefined,
      page: 1,
      limit: 50,
    });

    if (response.error) {
      console.error('Search error:', response.error);
      return [];
    }

    // Backend returns { data, total, page, limit }
    const results: any[] = normalizeSchoolArray((response as any).data);

    const mappedSchools: School[] = results.map(mapBackendSchool);

    // offersHighSchool — only meaningful for Secondary schools
    if (filters.offersHighSchool) {
      return mappedSchools.filter(school => school.offersHighSchool === true);
    }

    return mappedSchools;
  } catch (err) {
    console.error('Search API error:', err);
    return [];
  }
};

export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const response = await api.getSchool(id);

    if (response.error) {
      console.error('Get school error:', response.error);
      return null;
    }

    // Backend returns the school directly (not wrapped in data)
    const school: any = (response as any).data || response;
    return mapBackendSchool(school);
  } catch (err) {
    console.error('Get school API error:', err);
    return null;
  }
};
