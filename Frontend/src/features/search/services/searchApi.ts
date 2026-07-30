import { School, Filters } from '../types';
import api from '../../../lib/api';

export const searchSchools = async (filters: Filters): Promise<School[]> => {
  try {
    // Fetch from backend with applied filters
    const response = await api.getInstitutions({
      search: filters.searchQuery || undefined,
      region: filters.region.length > 0 ? filters.region[0] : undefined,
      type: filters.institutionType.length > 0 ? filters.institutionType[0] : undefined,
      page: 1,
      limit: 50,
    });

    if (response.error) {
      console.error('Search error:', response.error);
      return [];
    }

    // Backend returns { data, total, page, limit }
    const results = response.data || [];

    // Map backend institutions to frontend School type
    let mappedSchools = results.map((inst: any) => ({
      id: inst.id,
      name: inst.name,
      region: inst.region,
      institutionType: inst.type,
      curriculum: inst.programs?.map((p: any) => p.level) || [],
      degreeLevel: inst.programs?.map((p: any) => p.level) || [],
      programs: inst.programs?.map((p: any) => p.name) || [],
      feeRange: inst.programs?.[0]?.tuition ? `${inst.programs[0].tuition}` : '0',
      topRated: inst.verified || false,
      city: inst.city,
      rating: 4.5, // Placeholder
      logo: inst.imageUrl,
      description: inst.description,
    }));

    // Apply client-side filters for curriculum and degree level if needed
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
    const response = await api.getInstitution(id);

    if (response.error) {
      console.error('Get school error:', response.error);
      return null;
    }

    // Backend returns the institution directly (not wrapped in data)
    const inst = response.data || response;
    return {
      id: inst.id,
      name: inst.name,
      region: inst.region,
      institutionType: inst.type,
      curriculum: inst.programs?.map((p: any) => p.level) || [],
      degreeLevel: inst.programs?.map((p: any) => p.level) || [],
      programs: inst.programs?.map((p: any) => p.name) || [],
      feeRange: inst.programs?.[0]?.tuition ? `${inst.programs[0].tuition}` : '0',
      topRated: inst.verified || false,
      city: inst.city,
      rating: 4.5,
      logo: inst.imageUrl,
      description: inst.description,
    };
  } catch (err) {
    console.error('Get school API error:', err);
    return null;
  }
};