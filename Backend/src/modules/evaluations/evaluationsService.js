import crypto from "crypto";
import { evaluationsRepository } from "./evaluationsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

let verificationTokens = {}; // In Phase 2, store hashed in DB

export const evaluationsService = {
  async recordEvaluation(studentId, institutionId, score, notes) {
    if (score < 1 || score > 10) {
      throw new AppError("Score must be between 1 and 10", 400);
    }
    if (!institutionId || !studentId) {
      throw new AppError("Missing institutionId or studentId", 400);
    }

    const evaluation = await evaluationsRepository.create({
      studentId,
      institutionId,
      score: parseInt(score),
      notes,
    });

    // Get aggregate after creating new evaluation
    const aggregate = await evaluationsRepository.getAggregate(institutionId);

    return { evaluation, aggregate };
  },

  async getAggregateByInstitution(institutionId) {
    return evaluationsRepository.getAggregate(institutionId);
  },

  async generateVerificationToken(studentEmail) {
    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");
    // Store only the hash of the token
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    verificationTokens[hash] = {
      email: studentEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    // Return the unhashed token to send to student (they'll use it to verify)
    return token;
  },

  async verifyStudent(email, phone, verificationToken) {
    if (!email && !phone) {
      throw new AppError("Email or phone required", 400);
    }

    // Verify the token if provided
    if (verificationToken) {
      const hash = crypto.createHash("sha256").update(verificationToken).digest("hex");
      const stored = verificationTokens[hash];

      if (!stored || stored.expiresAt < Date.now()) {
        throw new AppError("Invalid or expired verification token", 401);
      }

      // Token is valid
      delete verificationTokens[hash]; // One-time use
      return { verified: true, email: stored.email };
    }

    // Without token, just verify basic info exists (mock verification)
    return { verified: true, email };
  },
};
