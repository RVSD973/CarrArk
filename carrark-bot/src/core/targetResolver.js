import { distance } from './geometry.js';
import { buildOMVectors } from './omGeometry.js';
import { trilaterate } from './trilateration.js';

const RELAX_STEP_KM = 0.1;
const RELAX_ATTEMPTS = 5;
const SURFACE_TOLERANCE_KM = 20;

export function resolveTarget({ omDistances, orbitalMarkerRadiusKm, bodyRadiusKm }) {
  const omVectors = buildOMVectors(orbitalMarkerRadiusKm);

  const selectedOMs = [];
  for (let index = 0; index < omVectors.length; index += 1) {
    const key = `om${index + 1}`;
    const value = Number(omDistances[key]);
    if (Number.isFinite(value) && value > 0) {
      selectedOMs.push({ ...omVectors[index], r: value, index });
    }
    if (selectedOMs.length === 3) {
      break;
    }
  }

  if (selectedOMs.length < 3) {
    return { success: false, error: 'Veuillez fournir au moins 3 distances OM valides.' };
  }

  let targetVectors = null;
  let relaxSteps = 0;

  while (!targetVectors && relaxSteps < RELAX_ATTEMPTS) {
    targetVectors = trilaterate(selectedOMs[0], selectedOMs[1], selectedOMs[2], false);
    if (!targetVectors) {
      selectedOMs.forEach((om) => {
        om.r += RELAX_STEP_KM;
      });
      relaxSteps += 1;
    }
  }

  if (!targetVectors) {
    return {
      success: false,
      error: 'Les distances fournies ne peuvent aboutir à une coordonnée valide. Merci de vérifier et valider votre saisie.'
    };
  }

  const center = { x: 0, y: 0, z: 0 };
  let target = targetVectors;

  if (Array.isArray(targetVectors)) {
    const middle = trilaterate(selectedOMs[0], selectedOMs[1], selectedOMs[2], true);
    const options = [...targetVectors, middle].sort((a, b) => {
      const ad = Math.abs(distance(a, center) - bodyRadiusKm);
      const bd = Math.abs(distance(b, center) - bodyRadiusKm);
      return ad - bd;
    });
    target = options[0];
  }

  const elevationErrorKm = Math.abs(distance(target, center) - bodyRadiusKm);
  if (elevationErrorKm > SURFACE_TOLERANCE_KM) {
    return {
      success: false,
      error: 'Les distances fournies ne correspondent pas à un emplacement de surface valide, cette application peut uniquement tracer un itinéraire vers un POI de surface.'
    };
  }

  return {
    success: true,
    position: target,
    usedOMs: selectedOMs.map((entry) => entry.index),
    elevationErrorKm,
    relaxationAppliedKm: Number((relaxSteps * RELAX_STEP_KM).toFixed(1)),
    note: 'Relâchement progressif de +0.1 km appliqué jusqu’à 5 tentatives pour compenser les saisies imprécises.'
  };
}
