import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { authRepository } from "./authRepository.js";
import { config } from "../../config/env.js";
import { AppError } from "../../middleware/errorHandler.js";

const JWT_OPTIONS = { algorithms: ["HS256"] };

export const authService = {
  async login(email, password) {
    const admin = await authRepository.findByEmail(email);
    if (!admin) {
      // Generic error to prevent email enumeration
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, name: admin.name },
      config.jwtSecret,
      { expiresIn: "24h", algorithm: "HS256" }
    );

    return {
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    };
  },

  async hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  },

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret, JWT_OPTIONS);
      return decoded;
    } catch (err) {
      throw new AppError("Invalid token", 401);
    }
  },
};