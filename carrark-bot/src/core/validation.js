const MAX_BODY_SIZE = 9000;

export function validateRouteInput({ distance, size, omDistances = {}, maxBodySize = MAX_BODY_SIZE }) {
  if (!distance || distance < 1) {
    return { valid: false, error: 'Sélectionnez un emplacement et la distance des 3 OM les plus proches du POI pour tracer votre itinéraire !' };
  }

  if (!size || size < 1) {
    return { valid: false, error: 'Veuillez fournir une distance entre la surface et le noyau pour tracer un itinéraire valide' };
  }

  if (distance > maxBodySize * 2) {
    return { valid: false, error: `La distance OM ne peut pas dépasser ${maxBodySize * 2} km.` };
  }

  if (size > maxBodySize) {
    return { valid: false, error: `Le rayon de l'astre ne peut pas dépasser ${maxBodySize} km.` };
  }

  const count = ['om1', 'om2', 'om3', 'om4', 'om5', 'om6']
    .map((key) => Number(omDistances[key]))
    .filter((value) => Number.isFinite(value) && value > 0).length;

  if (count < 3) {
    return { valid: false, error: 'Veuillez renseigner au moins 3 distances OM supérieures à 0.' };
  }

  return {
    valid: true,
    normalized: {
      distance: Number(distance),
      size: Number(size)
    }
  };
}
