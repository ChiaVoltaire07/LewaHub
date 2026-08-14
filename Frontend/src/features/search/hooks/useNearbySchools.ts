import { useCallback, useRef, useState } from 'react';
import { School, NearbyStatus } from '../types';
import { getNearbySchools } from '../services/nearbyApi';

export const DEFAULT_RADIUS_KM = 10;
export const RADIUS_OPTIONS_KM = [5, 10, 25, 50];

interface UserLocation {
  latitude: number;
  longitude: number;
}

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};

/**
 * Manages the "schools near me" flow: browser geolocation → nearby API call.
 * The user's location is held only in memory — it is never persisted.
 */
export const useNearbySchools = () => {
  const [status, setStatus] = useState<NearbyStatus>('idle');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [total, setTotal] = useState(0);
  // Monotonic id guards against stale responses overwriting newer ones.
  const requestIdRef = useRef(0);

  const fetchNearby = useCallback(async (
    latitude: number,
    longitude: number,
    radius: number
  ) => {
    const requestId = ++requestIdRef.current;
    setStatus('loading');
    const response = await getNearbySchools(latitude, longitude, radius);
    if (requestId !== requestIdRef.current) return; // stale
    if (!response) {
      setStatus('error');
      setSchools([]);
      setTotal(0);
      return;
    }
    setSchools(response.data);
    setTotal(response.total);
    setStatus('success');
  }, []);

  /** Requests the user's location, then loads schools within the current radius. */
  const findNearby = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      return;
    }

    requestIdRef.current += 1;
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchNearby(latitude, longitude, radiusKm);
      },
      (err: GeolocationPositionError) => {
        if (err.code === err.PERMISSION_DENIED) setStatus('denied');
        else if (err.code === err.POSITION_UNAVAILABLE) setStatus('unavailable');
        else if (err.code === err.TIMEOUT) setStatus('timeout');
        else setStatus('error');
      },
      GEOLOCATION_OPTIONS
    );
  }, [fetchNearby, radiusKm]);

  /** Re-runs the query with a new radius (only valid once we have a location). */
  const changeRadius = useCallback((radius: number) => {
    setRadiusKm(radius);
    setUserLocation((current) => {
      if (current) fetchNearby(current.latitude, current.longitude, radius);
      return current;
    });
  }, [fetchNearby]);

  /** Clears the nearby mode entirely. */
  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setStatus('idle');
    setUserLocation(null);
    setSchools([]);
    setTotal(0);
    setRadiusKm(DEFAULT_RADIUS_KM);
  }, []);

  return {
    status,
    userLocation,
    schools,
    radiusKm,
    total,
    findNearby,
    changeRadius,
    reset,
  };
};
