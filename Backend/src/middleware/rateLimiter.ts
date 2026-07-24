import rateLimit from 'express-rate-limit';

// Default limiter mounted globally in app.ts
export const baseRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please try again later.' } },
});

// Other teams (and this one) can call this to build a stricter limiter
// for a specific route, e.g. login or AI search.
export function createRateLimiter(windowMs: number, limit: number) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { message: 'Too many requests, please try again later.' } },
  });
}
