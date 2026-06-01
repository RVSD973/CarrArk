import test from 'node:test';
import assert from 'node:assert/strict';

import { buildOMVectors } from '../../src/core/omGeometry.js';
import { planRoute } from '../../src/core/routePlanner.js';
import { resolveTarget } from '../../src/core/targetResolver.js';

const cases = [
  {
    name: 'Daymar – Constellation Wreck',
    bodyRadiusKm: 295.2,
    orbitalMarkerRadiusKm: 430,
    omDistances: { om2: 486.5, om3: 460.7, om5: 168.4 }
  },
  {
    name: 'Clio – Starfarer Wreck',
    bodyRadiusKm: 240,
    orbitalMarkerRadiusKm: 352.2,
    omDistances: { om1: 294.9, om3: 208.6, om5: 397.8 }
  },
  {
    name: 'Lyria – Paradise Cove',
    bodyRadiusKm: 223,
    orbitalMarkerRadiusKm: 328.2,
    omDistances: { om2: 347.8, om3: 166.6, om6: 316.6 }
  },
  {
    name: 'Magda – Caterpillar Wreck',
    bodyRadiusKm: 341,
    orbitalMarkerRadiusKm: 494.8,
    omDistances: { om1: 550.2, om3: 516.8, om5: 205.3 }
  }
];

for (const entry of cases) {
  test(`route case: ${entry.name}`, () => {
    const resolved = resolveTarget({
      omDistances: entry.omDistances,
      orbitalMarkerRadiusKm: entry.orbitalMarkerRadiusKm,
      bodyRadiusKm: entry.bodyRadiusKm
    });

    assert.equal(resolved.success, true);
    assert.ok(resolved.elevationErrorKm <= 20);

    const routePlan = planRoute({
      targetPosition: resolved.position,
      omVectors: buildOMVectors(entry.orbitalMarkerRadiusKm)
    });

    assert.ok(routePlan.startOM.startsWith('OM'));
    assert.ok(routePlan.steps.length === 2 || routePlan.steps.length === 3);
    assert.equal(routePlan.usedOMs.length, 3);

    routePlan.steps.forEach((step) => {
      assert.ok(step.flyForKm > 0);
    });
  });
}
