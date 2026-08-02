import { School, Filters } from '../types';
import api from '../../../lib/api';

export const searchSchools = async (filters: Filters): Promise<School[]> => {
  try {
    // Fetch from backend with applied filters
    const response = await api.getSchools({
      search: filters.searchQuery || undefined,
      region: filters.region.length > 0 ? filters.region[0] : undefined,
      category: filters.category.length > 0 ? filters.category[0] : undefined,
      page: 1,
      limit: 50,
    });

    if (response.error) {
      console.error('Search error:', response.error);
      return [];
    }

    // Backend returns { data, total, page, limit }
    const results: any[] = (response as any).data || [];

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
      rating: 4.5, // Placeholder until ratings are implemented
      image: school.imageUrl || school.logo || '',
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
      rating: 4.5,
      image: school.imageUrl || school.logo || '',
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
