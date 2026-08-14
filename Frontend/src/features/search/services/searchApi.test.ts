import { describe, it, expect } from 'vitest';
import { mapBackendSchool } from './searchApi';

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
