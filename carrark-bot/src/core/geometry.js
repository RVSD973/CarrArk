export const EPSILON = 1e-9;

export function sqr(value) {
  return value * value;
}

export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function multiply(a, scalar) {
  return { x: a.x * scalar, y: a.y * scalar, z: a.z * scalar };
}

export function divide(a, scalar) {
  return { x: a.x / scalar, y: a.y / scalar, z: a.z / scalar };
}

export function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

export function norm(a) {
  return Math.sqrt(sqr(a.x) + sqr(a.y) + sqr(a.z));
}

export function normalize(a) {
  const length = norm(a);
  return length < EPSILON ? { x: 0, y: 0, z: 0 } : divide(a, length);
}

export function distance(a, b) {
  return norm(subtract(a, b));
}

export function planeFromPoints(a, b, c) {
  const normal = normalize(cross(subtract(b, a), subtract(c, a)));
  return { normal, constant: -dot(normal, a) };
}

export function intersectLineSegmentPlane(start, end, plane) {
  const direction = subtract(end, start);
  const denominator = dot(plane.normal, direction);
  if (Math.abs(denominator) < EPSILON) {
    return null;
  }

  const t = -(dot(plane.normal, start) + plane.constant) / denominator;
  if (t < -EPSILON || t > 1 + EPSILON) {
    return null;
  }

  return add(start, multiply(direction, t));
}

export function round1(value) {
  return Number(value.toFixed(1));
}
