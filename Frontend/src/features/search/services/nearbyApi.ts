import { School, NearbyResponse } from '../types';
import api from '../../../lib/api';
import { mapBackendSchool } from './searchApi';

const getDistanceNumber = (value: any): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

/** Like mapBackendSchool but also carries the distance fields. Pure & testable. */
export const mapNearbySchool = (school: any): School => ({
  ...mapBackendSchool(school),
  distanceKm: getDistanceNumber(school.distanceKm),
  distanceMeters: getDistanceNumber(school.distanceMeters),
});

/**
 * Fetches schools within `radius` km of a point. Returns the full envelope so
 * callers can show the search radius and the total count.
 */
export const getNearbySchools = async (
  latitude: number,
  longitude: number,
  radiusKm: number,
  limit = 20
): Promise<NearbyResponse | null> => {
  try {
    const response = await api.getNearbySchools({
      latitude,
      longitude,
      radius: radiusKm,
      page: 1,
      limit,
    });

    if (response.error) {
      console.error('Nearby schools error:', response.error);
      return null;
    }

    const payload: any = (response as any).data;
    const rows: any[] = Array.isArray(payload?.data) ? payload.data : [];

    return {
      data: rows.map(mapNearbySchool),
      center: {
        latitude: Number(payload?.center?.latitude),
        longitude: Number(payload?.center?.longitude),
      },
      radiusKm: Number(payload?.radiusKm),
      total: Number(payload?.total),
      page: Number(payload?.page),
      limit: Number(payload?.limit),
    };
  } catch (err) {
    console.error('Nearby schools API error:', err);
    return null;
  }
};
