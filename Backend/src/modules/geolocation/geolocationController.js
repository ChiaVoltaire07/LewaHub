import { geolocationService } from "./geolocationService.js";

export const geolocationController = {
  async findNearby(req, res, next) {
    try {
      const { latitude, longitude, radius = 50 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude required" });
      }

      const result = await geolocationService.findNearby(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
