import { School, Filters } from '../types';
import api from '../../../lib/api';

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const normalizeSchoolArray = (payload: any): any[] => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

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
      page: 1,
      limit: 50,
    });

    if (response.error) {
      console.error('Search error:', response.error);
      return [];
    }

    // Backend returns { data, total, page, limit }
    const results: any[] = normalizeSchoolArray((response as any).data);

    // Map backend schools to frontend School type
    let mappedSchools: School[] = results.map((school: any) => ({
      id: school.id,
      name: school.name,
      region: school.region,
      category: school.category,
      offersHighSchool: school.offersHighSchool || false,
      curriculum: school.programs?.map((p: any) => p.level) || [],
      degreeLevel: school.programs?.map((p: any) => p.level) || [],
      programs: school.programs?.map((p: any) => p.name) || [],
      feeRange: school.programs?.[0]?.tuition ? `${school.programs[0].tuition}` : '0',
      topRated: school.verified || false,
      rating: 0, // No ratings implemented yet — 0 means "no rating"
      image: school.imageUrl || school.logo || DEFAULT_SCHOOL_IMAGE,
      location: {
        lat: school.latitude || 5.5,
        lng: school.longitude || 12.5,
        address: school.address || school.city || '',
      },
      description: school.description || '',
    }));

    // Apply client-side filters
    if (filters.curriculum.length > 0) {
      mappedSchools = mappedSchools.filter(school =>
        school.curriculum.some(c => filters.curriculum.includes(c))
      );
    }

    if (filters.degreeLevel.length > 0) {
      mappedSchools = mappedSchools.filter(school =>
        school.degreeLevel.some(d => filters.degreeLevel.includes(d))
      );
    }

    // Filter by offersHighSchool — only meaningful for Secondary schools
    if (filters.offersHighSchool) {
      mappedSchools = mappedSchools.filter(school => school.offersHighSchool === true);
    }

    if (filters.topRated) {
      mappedSchools = mappedSchools.filter(school => school.topRated);
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
    return {
      id: school.id,
      name: school.name,
      region: school.region,
      category: school.category,
      offersHighSchool: school.offersHighSchool || false,
      curriculum: school.programs?.map((p: any) => p.level) || [],
      degreeLevel: school.programs?.map((p: any) => p.level) || [],
      programs: school.programs?.map((p: any) => p.name) || [],
      feeRange: school.programs?.[0]?.tuition ? `${school.programs[0].tuition}` : '0',
      topRated: school.verified || false,
      rating: 0,
      image: school.imageUrl || school.logo || DEFAULT_SCHOOL_IMAGE,
      location: {
        lat: school.latitude || 5.5,
        lng: school.longitude || 12.5,
        address: school.address || school.city || '',
      },
      description: school.description || '',
    };
  } catch (err) {
    console.error('Get school API error:', err);
    return null;
  }
};
