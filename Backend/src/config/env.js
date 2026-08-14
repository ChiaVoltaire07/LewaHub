// Environment configuration with fail-fast validation

const nodeEnv = process.env.NODE_ENV || "development";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function parseCsv(raw) {
  if (!raw || !raw.trim()) return null;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Allowed CORS origins. In production the localhost origins are NOT
// auto-included — only FRONTEND_URL and anything explicitly listed in
// CORS_ORIGINS are permitted.
function resolveCorsOrigins() {
  const explicit = parseCsv(process.env.CORS_ORIGINS);
  const list = explicit ? [...explicit] : [];
  if (!list.includes(frontendUrl)) list.push(frontendUrl);

  if (nodeEnv !== "production") {
    for (const local of ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]) {
      if (!list.includes(local)) list.push(local);
    }
  }
  return list;
}

// IPs (exact match) that are exempt from rate limiting, e.g. office NAT egress.
const rateLimitAllowlist = parseCsv(process.env.RATE_LIMIT_ALLOWLIST) || [];

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv,
  isProduction: nodeEnv === "production",
  frontendUrl,
  databaseUrl: process.env.DATABASE_URL,
  corsAllowedOrigins: resolveCorsOrigins(),
  rateLimitAllowlist,
  // Connection timeout guard (ms) against Slowloris-style idle connections.
  serverTimeoutMs: Number(process.env.SERVER_TIMEOUT_MS) || 30000,
  // Upper bound for a single HTTP request's headers.
  serverHeadersTimeoutMs: Number(process.env.SERVER_HEADERS_TIMEOUT_MS) || 10000,
};
