import { School, Filters } from '../types';
import { mockSchools } from '../data/mockSchools';

export const searchSchools = async (filters: Filters): Promise<School[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let results = [...mockSchools];

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(
      school =>
        school.name.toLowerCase().includes(query) ||
        school.programs.some(program => program.toLowerCase().includes(query)) ||
        school.region.toLowerCase().includes(query)
    );
  }

  // Filter by region
  if (filters.region.length > 0) {
    results = results.filter(school => filters.region.includes(school.region));
  }

  // Filter by institution type
  if (filters.institutionType.length > 0) {
    results = results.filter(school =>
      filters.institutionType.includes(school.institutionType)
    );
  }

  // Filter by curriculum
  if (filters.curriculum.length > 0) {
    results = results.filter(school =>
      school.curriculum.some(c => filters.curriculum.includes(c))
    );
  }

  // Filter by degree level
  if (filters.degreeLevel.length > 0) {
    results = results.filter(school =>
      school.degreeLevel.some(d => filters.degreeLevel.includes(d))
    );
  }

  // Filter by fee range
  if (filters.feeRange.length > 0) {
    results = results.filter(school => {
      return filters.feeRange.some(range => {
        if (range === '500000+') {
          return parseInt(school.feeRange.replace(/[^0-9]/g, '').slice(0, 6)) >= 500000;
        }
        if (range === '0-100000') {
          const maxFee = parseInt(school.feeRange.replace(/[^0-9]/g, '').slice(0, 6));
          return maxFee <= 100000;
        }
        const [min, max] = range.split('-').map(Number);
        const schoolFee = parseInt(school.feeRange.replace(/[^0-9]/g, '').slice(0, 6));
        return schoolFee >= min && schoolFee <= max;
      });
    });
  }

  // Filter by top rated
  if (filters.topRated) {
    results = results.filter(school => school.topRated);
  }

  return results;
};

export const getSchoolById = async (id: string): Promise<School | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockSchools.find(school => school.id === id) || null;
};