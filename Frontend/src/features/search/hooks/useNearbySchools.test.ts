// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNearbySchools, RADIUS_OPTIONS_KM } from './useNearbySchools';

vi.mock('../services/nearbyApi', () => ({
  getNearbySchools: vi.fn(),
}));

import { getNearbySchools } from '../services/nearbyApi';

const mockedGetNearbySchools = vi.mocked(getNearbySchools);

const school = {
  id: 's1',
  name: 'A',
  region: 'Centre',
  category: 'Secondary',
  offersHighSchool: false,
  curriculum: [],
  degreeLevel: [],
  programs: [],
  verified: true,
  image: 'x.jpg',
  location: { lat: 3.86, lng: 11.51, address: '' },
  description: '',
  distanceKm: 1.2,
  distanceMeters: 1200,
};

const makeEnvelope = (radiusKm: number) => ({
  data: [school],
  center: { latitude: 3.848, longitude: 11.5021 },
  radiusKm,
  total: 1,
  page: 1,
  limit: 20,
});

const getCurrentPositionMock = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  mockedGetNearbySchools.mockResolvedValue(makeEnvelope(10));
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition: getCurrentPositionMock },
  });
});

describe('useNearbySchools', () => {
  it('starts idle with no location and default radius 10', () => {
    const { result } = renderHook(() => useNearbySchools());
    expect(result.current.status).toBe('idle');
    expect(result.current.userLocation).toBeNull();
    expect(result.current.radiusKm).toBe(10);
    expect(RADIUS_OPTIONS_KM).toEqual([5, 10, 25, 50]);
  });

  it('locates the user then fetches and stores nearby schools', async () => {
    getCurrentPositionMock.mockImplementation((success: any) => {
      // Simulate async geolocation so the intermediate 'locating' state is observable
      setTimeout(() => {
        success({ coords: { latitude: 3.848, longitude: 11.5021 } });
      }, 0);
    });

    const { result } = renderHook(() => useNearbySchools());

    act(() => {
      result.current.findNearby();
    });

    expect(result.current.status).toBe('locating');

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.userLocation).toEqual({ latitude: 3.848, longitude: 11.5021 });
    expect(result.current.schools).toEqual([school]);
    expect(result.current.total).toBe(1);
    expect(mockedGetNearbySchools).toHaveBeenCalledWith(3.848, 11.5021, 10);
  });

  it('maps geolocation permission denial to status denied', () => {
    const error = { code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 };
    getCurrentPositionMock.mockImplementation((_success: any, failure: any) => {
      failure(error);
    });

    const { result } = renderHook(() => useNearbySchools());

    act(() => {
      result.current.findNearby();
    });

    expect(result.current.status).toBe('denied');
    expect(result.current.userLocation).toBeNull();
  });

  it('maps timeout to status timeout', () => {
    const error = { code: 3, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 };
    getCurrentPositionMock.mockImplementation((_success: any, failure: any) => {
      failure(error);
    });

    const { result } = renderHook(() => useNearbySchools());

    act(() => {
      result.current.findNearby();
    });

    expect(result.current.status).toBe('timeout');
  });

  it('reports unsupported when geolocation is unavailable', () => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: undefined });

    const { result } = renderHook(() => useNearbySchools());

    act(() => {
      result.current.findNearby();
    });

    expect(result.current.status).toBe('unsupported');
  });

  it('sets error status when the API call fails', async () => {
    getCurrentPositionMock.mockImplementation((success: any) => {
      success({ coords: { latitude: 3.848, longitude: 11.5021 } });
    });
    mockedGetNearbySchools.mockResolvedValue(null);

    const { result } = renderHook(() => useNearbySchools());

    act(() => {
      result.current.findNearby();
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
    expect(result.current.schools).toEqual([]);
  });

  it('changeRadius refetches with the new radius', async () => {
    getCurrentPositionMock.mockImplementation((success: any) => {
      success({ coords: { latitude: 3.848, longitude: 11.5021 } });
    });
    mockedGetNearbySchools.mockResolvedValue(makeEnvelope(25));

    const { result } = renderHook(() => useNearbySchools());

    act(() => {
      result.current.findNearby();
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    act(() => {
      result.current.changeRadius(25);
    });

    await waitFor(() => {
      expect(mockedGetNearbySchools).toHaveBeenLastCalledWith(3.848, 11.5021, 25);
    });
    expect(result.current.radiusKm).toBe(25);
  });

  it('reset clears the nearby state', async () => {
    getCurrentPositionMock.mockImplementation((success: any) => {
      success({ coords: { latitude: 3.848, longitude: 11.5021 } });
    });

    const { result } = renderHook(() => useNearbySchools());

    act(() => {
      result.current.findNearby();
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.userLocation).toBeNull();
    expect(result.current.schools).toEqual([]);
    expect(result.current.radiusKm).toBe(10);
  });
});
