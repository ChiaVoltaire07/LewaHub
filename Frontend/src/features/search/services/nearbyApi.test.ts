import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../lib/api', () => ({
  default: {
    getNearbySchools: vi.fn(),
  },
}));

import api from '../../../lib/api';
import { mapNearbySchool, getNearbySchools } from './nearbyApi';

const mockedGetNearbySchools = vi.mocked(api.getNearbySchools);

const rawRow = {
  id: 'sch_n1',
  name: 'Lycée de Ngoa-Ékélé',
  region: 'Centre',
  category: 'Secondary',
  latitude: 3.8667,
  longitude: 11.5167,
  distanceKm: 2.345,
  distanceMeters: 2345,
  programs: [{ level: 'Secondary', name: 'General Secondary' }],
};

describe('mapNearbySchool', () => {
  it('maps a backend row and preserves the distance fields', () => {
    const school = mapNearbySchool(rawRow);

    expect(school.id).toBe('sch_n1');
    expect(school.location).toEqual({ lat: 3.8667, lng: 11.5167, address: '' });
    expect(school.distanceKm).toBe(2.345);
    expect(school.distanceMeters).toBe(2345);
  });

  it('drops non-numeric distance fields', () => {
    const school = mapNearbySchool({ ...rawRow, distanceKm: 'far', distanceMeters: undefined });
    expect(school.distanceKm).toBeUndefined();
    expect(school.distanceMeters).toBeUndefined();
  });
});

describe('getNearbySchools', () => {
  beforeEach(() => {
    mockedGetNearbySchools.mockReset();
  });

  it('returns the envelope with mapped schools', async () => {
    mockedGetNearbySchools.mockResolvedValue({
      data: {
        data: [rawRow],
        center: { latitude: 3.848, longitude: 11.5021 },
        radiusKm: 10,
        total: 1,
        page: 1,
        limit: 20,
      },
    });

    const result = await getNearbySchools(3.848, 11.5021, 10);

    expect(mockedGetNearbySchools).toHaveBeenCalledWith({
      latitude: 3.848,
      longitude: 11.5021,
      radius: 10,
      page: 1,
      limit: 20,
    });
    expect(result?.center).toEqual({ latitude: 3.848, longitude: 11.5021 });
    expect(result?.radiusKm).toBe(10);
    expect(result?.total).toBe(1);
    expect(result?.data[0].distanceKm).toBe(2.345);
  });

  it('returns null on API error', async () => {
    mockedGetNearbySchools.mockResolvedValue({ error: 'boom', status: 400 });
    const result = await getNearbySchools(3.848, 11.5021, 10);
    expect(result).toBeNull();
  });

  it('returns an empty envelope when the payload has no rows', async () => {
    mockedGetNearbySchools.mockResolvedValue({
      data: { data: [], center: { latitude: 0, longitude: 0 }, radiusKm: 5, total: 0, page: 1, limit: 20 },
    });
    const result = await getNearbySchools(0, 0, 5);
    expect(result?.data).toEqual([]);
    expect(result?.total).toBe(0);
  });

  it('returns null when the request throws', async () => {
    mockedGetNearbySchools.mockRejectedValue(new Error('network'));
    const result = await getNearbySchools(3.848, 11.5021, 10);
    expect(result).toBeNull();
  });
});
