import { institutionsRepository } from "../institutions/institutionsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const geolocationService = {
  // Haversine formula for calculating distance between two coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  },

  async findNearby(latitude, longitude, radiusKm = 50) {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new AppError("Invalid latitude/longitude", 400);
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new AppError("Latitude must be -90 to 90, longitude must be -180 to 180", 400);
    }

    const result = await institutionsRepository.findAll({ page: 1, limit: 1000 });

    const nearby = result.data
      .map((inst) => ({
        ...inst,
        distance: this.calculateDistance(latitude, longitude, inst.latitude, inst.longitude),
      }))
      .filter((inst) => inst.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return {
      center: { latitude, longitude },
      radius: radiusKm,
      results: nearby,
      count: nearby.length,
    };
  },
};
