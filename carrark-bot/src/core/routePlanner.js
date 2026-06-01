import {
  distance,
  intersectLineSegmentPlane,
  planeFromPoints,
  round1
} from './geometry.js';

function omNameFromIndex(index) {
  return `OM${index + 1}`;
}

function sortByTargetDistance(omVectors, targetPosition) {
  return omVectors
    .map((vector, index) => ({ vector, index }))
    .sort((a, b) => distance(a.vector, targetPosition) - distance(b.vector, targetPosition));
}

export function planRoute({ targetPosition, omVectors, scale = 1 }) {
  if (!targetPosition) {
    throw new Error('targetPosition est requis.');
  }

  if (!Array.isArray(omVectors) || omVectors.length !== 6) {
    throw new Error('omVectors doit contenir 6 marqueurs orbitaux.');
  }

  const center = { x: 0, y: 0, z: 0 };
  const sorted = sortByTargetDistance(omVectors, targetPosition);
  const [first, second, third] = sorted;

  const vector0 = first.vector;
  const vector1 = second.vector;
  const vector2 = third.vector;

  const name0 = omNameFromIndex(first.index);
  const name1 = omNameFromIndex(second.index);
  const name2 = omNameFromIndex(third.index);

  const omDistanceMap = {
    [name0.toLowerCase()]: round1(distance(vector0, targetPosition) / scale),
    [name1.toLowerCase()]: round1(distance(vector1, targetPosition) / scale),
    [name2.toLowerCase()]: round1(distance(vector2, targetPosition) / scale)
  };

  const testPlane = planeFromPoints(vector0, vector1, vector2);
  const testVector = intersectLineSegmentPlane(center, targetPosition, testPlane);

  const plane2 = planeFromPoints(vector2, targetPosition, center);
  const line1Target = intersectLineSegmentPlane(vector0, vector1, plane2);

  if (!line1Target) {
    throw new Error('Impossible de calculer la première étape de navigation.');
  }

  if (testVector) {
    return {
      startOM: name0,
      usedOMs: [name0, name1, name2],
      threeStep: false,
      omDistanceMap,
      steps: [
        {
          direction: name1,
          flyForKm: round1(distance(vector0, line1Target) / scale),
          checkOM: name1,
          checkDistanceKm: round1(distance(line1Target, vector1) / scale)
        },
        {
          direction: name2,
          flyForKm: round1(distance(line1Target, targetPosition) / scale),
          checkOM: name2,
          checkDistanceKm: round1(distance(targetPosition, vector2) / scale),
          note: `Arrivée au niveau de la surface, gardez votre cap vers ${name2} jusqu'à atteindre votre objectif.`
        }
      ]
    };
  }

  const plane3 = planeFromPoints(vector1, targetPosition, center);
  const line2Target = intersectLineSegmentPlane(line1Target, vector2, plane3);

  if (!line2Target) {
    throw new Error('Impossible de calculer la deuxième étape de navigation.');
  }

  return {
    startOM: name0,
    usedOMs: [name0, name1, name2],
    threeStep: true,
    omDistanceMap,
    steps: [
      {
        direction: name1,
        flyForKm: round1(distance(vector0, line1Target) / scale),
        checkOM: name1,
        checkDistanceKm: round1(distance(line1Target, vector1) / scale)
      },
      {
        direction: name2,
        flyForKm: round1(distance(line1Target, line2Target) / scale),
        checkOM: name2,
        checkDistanceKm: round1(distance(line2Target, vector2) / scale)
      },
      {
        direction: 'Centre de la planète/lune',
        flyForKm: round1(distance(line2Target, targetPosition) / scale),
        note: 'Terminez la navigation en vous alignant sur deux des trois OM renseignés.'
      }
    ]
  };
}
