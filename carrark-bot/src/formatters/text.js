export function formatRouteText(routePlan) {
  const lines = [`Départ à moins de 100 mètres de ${routePlan.startOM}.`];

  routePlan.steps.forEach((step, index) => {
    let line = `${index + 1}. Direction ${step.direction}: voler ${step.flyForKm} km`;
    if (step.checkOM && Number.isFinite(step.checkDistanceKm)) {
      line += ` jusqu'à ${step.checkDistanceKm} km de ${step.checkOM}`;
    }
    line += '.';
    lines.push(line);
    if (step.note) {
      lines.push(`   ${step.note}`);
    }
  });

  return lines.join('\n');
}
