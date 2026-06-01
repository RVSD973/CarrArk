import {
  add,
  cross,
  divide,
  dot,
  norm,
  sqr,
  subtract,
  multiply
} from './geometry.js';

export function trilaterate(p1, p2, p3, returnMiddle = false) {
  const ex = divide(subtract(p2, p1), norm(subtract(p2, p1)));
  const i = dot(ex, subtract(p3, p1));
  const a = subtract(subtract(p3, p1), multiply(ex, i));
  const ey = divide(a, norm(a));
  const ez = cross(ex, ey);
  const d = norm(subtract(p2, p1));
  const j = dot(ey, subtract(p3, p1));

  const x = (sqr(p1.r) - sqr(p2.r) + sqr(d)) / (2 * d);
  const y = (sqr(p1.r) - sqr(p3.r) + sqr(i) + sqr(j)) / (2 * j) - (i / j) * x;
  const z = Math.sqrt(sqr(p1.r) - sqr(x) - sqr(y));

  if (Number.isNaN(z)) {
    return null;
  }

  const middle = add(p1, add(multiply(ex, x), multiply(ey, y)));
  const p4a = add(middle, multiply(ez, z));
  const p4b = subtract(middle, multiply(ez, z));

  if (z === 0 || returnMiddle) {
    return { x: middle.x, y: middle.y, z: middle.z };
  }

  return [
    { x: p4a.x, y: p4a.y, z: p4a.z },
    { x: p4b.x, y: p4b.y, z: p4b.z }
  ];
}
