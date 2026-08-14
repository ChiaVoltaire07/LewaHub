// API smoke tests for the public read-only backend.
// Run against the local dev database (read-only assertions).
import "dotenv/config";
import { before, after, test } from "node:test";
import assert from "node:assert/strict";

// Must be set before app.js is imported so config/env.js picks it up.
process.env.NODE_ENV = "test";
process.env.AI_API_KEY = "";

const { app } = await import("../src/app.js");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(() => {
  server?.close();
});

test("GET /health returns ok", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("GET /schools lists schools with pagination envelope", async () => {
  const res = await fetch(`${baseUrl}/schools?page=1&limit=2`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data));
  assert.equal(body.data.length, 2);
  assert.equal(typeof body.total, "number");
  assert.equal(body.page, 1);
  assert.equal(body.limit, 2);
});

test("GET /schools sets X-Cache header", async () => {
  const res = await fetch(`${baseUrl}/schools?page=1&limit=1`);
  assert.ok(res.headers.has("x-cache"));
});

test("GET /schools rejects invalid page", async () => {
  const res = await fetch(`${baseUrl}/schools?page=abc`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.ok(body.error);
});

test("GET /schools rejects limit above maximum", async () => {
  const res = await fetch(`${baseUrl}/schools?limit=1000`);
  assert.equal(res.status, 400);
});

test("GET /schools with verified=true only returns verified schools", async () => {
  const res = await fetch(`${baseUrl}/schools?verified=true&limit=5`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((s) => s.verified === true));
});

test("GET /schools/nearby returns schools within radius with distance + center envelope", async () => {
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=3.8&longitude=11.5&radius=50&limit=5`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data));
  assert.equal(typeof body.total, "number");
  assert.deepEqual(body.center, { latitude: 3.8, longitude: 11.5 });
  assert.equal(body.radiusKm, 50);
  assert.equal(body.page, 1);
  assert.equal(body.limit, 5);
  assert.ok(body.data.length <= 5);

  // Every result exposes distance fields and keeps valid coordinates
  for (const school of body.data) {
    assert.equal(typeof school.distanceKm, "number");
    assert.equal(typeof school.distanceMeters, "number");
    assert.ok(school.distanceKm > 0);
    assert.equal(typeof school.latitude, "number");
    assert.equal(typeof school.longitude, "number");
    assert.ok(school.distanceKm <= 50, `distance ${school.distanceKm} exceeds radius`);
  }
});

test("GET /schools/nearby orders results nearest → farthest", async () => {
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=3.848&longitude=11.5021&radius=100&limit=50`);
  assert.equal(res.status, 200);
  const body = await res.json();
  const distances = body.data.map((s) => s.distanceKm);
  const sorted = [...distances].sort((a, b) => a - b);
  assert.deepEqual(distances, sorted);
});

test("GET /schools/nearby rejects out-of-range latitude", async () => {
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=95&longitude=11.5`);
  assert.equal(res.status, 400);
});

test("GET /schools/nearby rejects out-of-range longitude", async () => {
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=3.8&longitude=200`);
  assert.equal(res.status, 400);
});

test("GET /schools/nearby rejects NaN latitude", async () => {
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=abc&longitude=11.5`);
  assert.equal(res.status, 400);
});

test("GET /schools/nearby rejects zero/negative radius", async () => {
  const zero = await fetch(`${baseUrl}/schools/nearby?latitude=3.8&longitude=11.5&radius=0`);
  assert.equal(zero.status, 400);
  const negative = await fetch(`${baseUrl}/schools/nearby?latitude=3.8&longitude=11.5&radius=-5`);
  assert.equal(negative.status, 400);
});

test("GET /schools/nearby rejects radius above maximum (100 km)", async () => {
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=3.8&longitude=11.5&radius=101`);
  assert.equal(res.status, 400);
});

test("GET /schools/nearby rejects invalid limit values", async () => {
  const zero = await fetch(`${baseUrl}/schools/nearby?latitude=3.8&longitude=11.5&limit=0`);
  assert.equal(zero.status, 400);
  const huge = await fetch(`${baseUrl}/schools/nearby?latitude=3.8&longitude=11.5&limit=1000000`);
  assert.equal(huge.status, 400);
});

test("GET /schools/nearby returns empty results for a location with no schools", async () => {
  // Point in the South Atlantic, far from every school
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=-30&longitude=15&radius=10`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body.data, []);
  assert.equal(body.total, 0);
});

test("GET /schools/nearby excludes schools without coordinates", async () => {
  const res = await fetch(`${baseUrl}/schools/nearby?latitude=3.848&longitude=11.5021&radius=100&limit=50`);
  assert.equal(res.status, 200);
  const body = await res.json();
  // Every nearby result must carry numeric coordinates and a distance
  assert.ok(body.data.every((s) => typeof s.latitude === "number" && typeof s.longitude === "number"));
});

test("removed geolocation module returns 404", async () => {
  const res = await fetch(`${baseUrl}/geolocation/nearby?latitude=3.8&longitude=11.5`);
  assert.equal(res.status, 404);
});

test("GET /search returns keyword results without AI key", async () => {
  const res = await fetch(`${baseUrl}/search?q=sciences`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.aiParsed, false);
  assert.ok(Array.isArray(body.results));
});

test("GET /search rejects too-short query", async () => {
  const res = await fetch(`${baseUrl}/search?q=a`);
  assert.equal(res.status, 400);
});

test("GET /schools/:id returns a serialized school detail", async () => {
  const list = await (await fetch(`${baseUrl}/schools?limit=1`)).json();
  const id = list.data[0].id;
  const res = await fetch(`${baseUrl}/schools/${id}`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.id, id);
  assert.equal(typeof body.name, "string");
  assert.equal(typeof body.region, "string");
  assert.ok(["PrimaryNursery", "Secondary", "University"].includes(body.category));
  assert.equal(typeof body.verified, "boolean");
});
