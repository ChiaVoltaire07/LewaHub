import "dotenv/config";
import { app } from "./app.js";
import { config } from "./config/env.js";

// Health check endpoint (BEFORE server starts)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server with timeout guards against slow/idle connections
const server = app.listen(config.port, () => {
  console.log(`\n✓ LewaHub API running on http://localhost:${config.port}/api/v1`);
});

server.timeout = config.serverTimeoutMs; // idle socket timeout
server.headersTimeout = config.serverHeadersTimeoutMs; // max time to receive headers
server.requestTimeout = config.serverTimeoutMs; // max time for a request to complete