import test from 'node:test';
import assert from 'node:assert/strict';
import { trilaterate } from '../../src/core/trilateration.js';

function approx(actual, expected, epsilon = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `Expected ${actual} ~= ${expected}`);
}

test('trilaterate returns mirrored pair for non-planar target', () => {
  const target = { x: 2, y: 3, z: 4 };
  const p1 = { x: 0, y: 0, z: 0, r: Math.sqrt(29) };
  const p2 = { x: 10, y: 0, z: 0, r: Math.sqrt(89) };
  const p3 = { x: 0, y: 10, z: 0, r: Math.sqrt(69) };

  const result = trilaterate(p1, p2, p3, false);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 2);

  const hasTarget = result.some((point) =>
    Math.abs(point.x - target.x) < 1e-6 && Math.abs(point.y - target.y) < 1e-6 && Math.abs(point.z - target.z) < 1e-6
  );

  assert.equal(hasTarget, true);
});

test('trilaterate returns middle point when requested', () => {
  const p1 = { x: 0, y: 0, z: 0, r: Math.sqrt(29) };
  const p2 = { x: 10, y: 0, z: 0, r: Math.sqrt(89) };
  const p3 = { x: 0, y: 10, z: 0, r: Math.sqrt(69) };

  const middle = trilaterate(p1, p2, p3, true);
  approx(middle.x, 2);
  approx(middle.y, 3);
  approx(middle.z, 0);
});

test('trilaterate returns null for impossible distances', () => {
  const p1 = { x: 0, y: 0, z: 0, r: 1 };
  const p2 = { x: 10, y: 0, z: 0, r: 1 };
  const p3 = { x: 0, y: 10, z: 0, r: 1 };

  const result = trilaterate(p1, p2, p3, false);
  assert.equal(result, null);
});
