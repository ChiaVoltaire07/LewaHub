import { test } from "node:test";
import assert from "node:assert/strict";

import { calculateDistanceKm, attachDistance } from "../src/lib/distance.js";

test("calculateDistanceKm returns ~0 for identical points", () => {
  assert.equal(calculateDistanceKm(3.848, 11.5021, 3.848, 11.5021), 0);
});

test("calculateDistanceKm: ~111 km per degree of latitude", () => {
  const d = calculateDistanceKm(0, 0, 1, 0);
  assert.ok(d > 110 && d < 112, `expected ~111 km, got ${d}`);
});

test("calculateDistanceKm: ~111 km per degree of longitude at the equator", () => {
  const d = calculateDistanceKm(0, 0, 0, 1);
  assert.ok(d > 110 && d < 112, `expected ~111 km, got ${d}`);
});

test("calculateDistanceKm: order of points does not matter", () => {
  const ab = calculateDistanceKm(3.848, 11.5021, 6.35, 10.5);
  const ba = calculateDistanceKm(6.35, 10.5, 3.848, 11.5021);
  assert.ok(Math.abs(ab - ba) < 1e-9);
});

test("calculateDistanceKm: Douala ↔ Yaoundé (≈ 220 km)", () => {
  const d = calculateDistanceKm(4.0511, 9.7679, 3.848, 11.5021);
  assert.ok(d > 180 && d < 260, `expected ≈220 km, got ${d}`);
});

test("calculateDistanceKm: longitude at higher latitude is shorter", () => {
  // 1° of longitude at 45°N ≈ 79 km, far less than the 111 km at the equator
  const polar = calculateDistanceKm(45, 0, 45, 1);
  const equator = calculateDistanceKm(0, 0, 0, 1);
  assert.ok(polar < equator);
  assert.ok(polar > 75 && polar < 85, `expected ≈79 km, got ${polar}`);
});

test("attachDistance adds rounded km and meters", () => {
  const school = { id: 1, name: "A" };
  const out = attachDistance(school, 1.2345678);
  assert.equal(out.distanceKm, 1.235);
  assert.equal(out.distanceMeters, 1235);
  assert.equal(school.distanceKm, undefined); // original untouched
});

test("attachDistance returns the school unchanged when distance is missing", () => {
  const school = { id: 2 };
  assert.equal(attachDistance(school, undefined), school);
  assert.equal(attachDistance(school, NaN), school);
});
