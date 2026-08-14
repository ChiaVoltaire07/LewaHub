import { AppError } from "../middleware/errorHandler.js";

/**
 * Map a thrown error to a safe, client-friendly AppError.
 * Prisma error codes become stable business codes; anything unknown becomes
 * a generic INTERNAL_ERROR so internals never leak to clients.
 */
export function toAppError(error, fallbackMessage = "Internal server error") {
  if (error instanceof AppError) return error;

  // Prisma known request errors (P2xxx) — safe to expose as status codes.
  switch (error?.code) {
    case "P2002":
      return new AppError("A record with these values already exists.", 409, "DUPLICATE_RECORD");
    case "P2025":
      return new AppError("The requested record was not found.", 404, "NOT_FOUND");
    case "P2003":
      return new AppError("This record is still referenced by other data.", 409, "RELATION_CONFLICT");
    default:
      return new AppError(fallbackMessage, 500, "INTERNAL_ERROR");
  }
}
