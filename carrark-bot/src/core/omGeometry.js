export function buildOMVectors(orbitalMarkerRadiusKm) {
  return [
    { x: 0, y: 0, z: orbitalMarkerRadiusKm },
    { x: 0, y: 0, z: -orbitalMarkerRadiusKm },
    { x: 0, y: orbitalMarkerRadiusKm, z: 0 },
    { x: 0, y: -orbitalMarkerRadiusKm, z: 0 },
    { x: orbitalMarkerRadiusKm, y: 0, z: 0 },
    { x: -orbitalMarkerRadiusKm, y: 0, z: 0 }
  ];
}
