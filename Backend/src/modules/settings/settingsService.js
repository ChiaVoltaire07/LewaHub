import bcryptjs from "bcryptjs";
import { authRepository } from "../auth/authRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const settingsService = {
  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await authRepository.findById(adminId);
    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    const isCurrentValid = await bcryptjs.compare(currentPassword, admin.password);
    if (!isCurrentValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    await authRepository.update(adminId, {
      password: hashedNewPassword,
    });

    return {
      message: "Password updated successfully",
      admin: { id: admin.id, email: admin.email, name: admin.name },
    };
  },
};