import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapBackendSchool, searchSchools } from './searchApi';

const { apiMock } = vi.hoisted(() => ({
  apiMock: { getSchools: vi.fn(), getSchool: vi.fn() },
}));

vi.mock('../../../lib/api', () => ({
  api: apiMock,
  default: apiMock,
}));

import { api } from '../../../lib/api';

const mockedGetSchools = vi.mocked(api.getSchools);

beforeEach(() => {
  vi.resetAllMocks();
  mockedGetSchools.mockResolvedValue({ data: [] } as any);
});

describe('mapBackendSchool', () => {
  it('maps the legacy backend fields onto the frontend School shape', () => {
    const raw = {
      id: 'sch_1',
      name: 'Lycée Général Leclerc',
      region: 'Centre',
      category: 'Secondary',
      offersHighSchool: true,
      verified: true,
      address: 'Avenue Kennedy',
      city: 'Yaoundé',
      latitude: 3.8667,
      longitude: 11.5167,
      imageUrl: 'https://example.com/photo.jpg',
      programs: [
        { level: 'Secondary', name: 'General Secondary' },
        { level: 'High School', name: 'Advanced Level' },
      ],
    };

    const school = mapBackendSchool(raw);

    expect(school.id).toBe('sch_1');
    expect(school.name).toBe('Lycée Général Leclerc');
    expect(school.region).toBe('Centre');
    expect(school.category).toBe('Secondary');
    expect(school.offersHighSchool).toBe(true);
    expect(school.verified).toBe(true);
    expect(school.image).toBe('https://example.com/photo.jpg');
    expect(school.location).toEqual({ lat: 3.8667, lng: 11.5167, address: 'Avenue Kennedy' });
    expect(school.programs).toEqual(['General Secondary', 'Advanced Level']);
    expect(school.curriculum).toEqual(['Secondary', 'High School']);
  });

  it('uses null coordinates when the backend has none', () => {
    const school = mapBackendSchool({
      id: 'sch_2',
      name: 'Unknown',
      region: 'West',
      category: 'University',
      latitude: null,
      longitude: null,
      address: '',
      programs: [],
    });

    expect(school.location.lat).toBeNull();
    expect(school.location.lng).toBeNull();
    expect(school.verified).toBe(false);
    expect(school.offersHighSchool).toBe(false);
  });

  it('falls back to the default image when no imageUrl is present', () => {
    const school = mapBackendSchool({
      id: 'sch_3',
      name: 'No Photo',
      region: 'Littoral',
      category: 'PrimaryNursery',
      programs: [],
    });

    expect(school.image).toMatch(/unsplash\.com/);
  });

  it('maps an empty program list to empty arrays', () => {
    const school = mapBackendSchool({
      id: 'sch_4',
      name: 'Empty',
      region: 'Centre',
      category: 'University',
      programs: [],
    });

    expect(school.programs).toEqual([]);
    expect(school.curriculum).toEqual([]);
    expect(school.degreeLevel).toEqual([]);
  });
});

describe('searchSchools', () => {
  const baseFilters = {
    region: [],
    category: [],
    offersHighSchool: undefined,
    verified: false,
    searchQuery: '',
    ownership: [],
    boarding: [],
    programs: [],
    language: [],
    specialities: [],
  };

  it('passes the program and speciality filters to the backend', async () => {
    await searchSchools({
      ...baseFilters,
      programs: ['Bachelor of Science in Computer Science'],
      specialities: ['Computer Science'],
    });

    const args = mockedGetSchools.mock.calls[0]?.[0];
    expect(args?.program).toBe('Bachelor of Science in Computer Science');
    expect(args?.speciality).toBe('Computer Science');
  });

  it('does not send speciality when none is selected', async () => {
    await searchSchools({ ...baseFilters, programs: ['GCE Advanced Level'] });

    const args = mockedGetSchools.mock.calls[0]?.[0];
    expect(args?.program).toBe('GCE Advanced Level');
    expect(args?.speciality).toBeUndefined();
  });

  it('returns an empty list when the backend reports an error', async () => {
    mockedGetSchools.mockResolvedValue({ error: 'HTTP 500', status: 500 } as any);
    const results = await searchSchools(baseFilters);
    expect(results).toEqual([]);
  });

  it('filters out non-high-school secondary schools when offersHighSchool is set', async () => {
    mockedGetSchools.mockResolvedValue({
      data: [
        { id: 'a', name: 'A', region: 'Centre', category: 'Secondary', offersHighSchool: true, programs: [], verified: false, latitude: null, longitude: null, address: '' },
        { id: 'b', name: 'B', region: 'Centre', category: 'Secondary', offersHighSchool: false, programs: [], verified: false, latitude: null, longitude: null, address: '' },
      ],
    } as any);

    const results = await searchSchools({ ...baseFilters, offersHighSchool: true });
    expect(results.map((s) => s.id)).toEqual(['a']);
  });
});
