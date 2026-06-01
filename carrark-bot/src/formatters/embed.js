import { EmbedBuilder } from 'discord.js';

const STEP_COLORS = [0xb16286, 0x458588, 0xC4D7E6];
const ACCENT_COLOR = 0xfada7d;

export function buildRouteEmbed({ title, body, routePlan, shareUrl }) {
  const embed = new EmbedBuilder()
    .setColor(ACCENT_COLOR)
    .setTitle(title || 'Itinéraire CarrArk')
    .setDescription(`${body.name} • ${body.system}`)
    .addFields({ name: 'OM de départ', value: routePlan.startOM, inline: true });

  routePlan.steps.forEach((step, index) => {
    const lines = [`Direction: **${step.direction}**`, `Voler: **${step.flyForKm} km**`];
    if (step.checkOM) {
      lines.push(`Contrôle: **${step.checkDistanceKm} km** de ${step.checkOM}`);
    }
    if (step.note) {
      lines.push(step.note);
    }

    embed.addFields({
      name: `Étape ${index + 1}`,
      value: lines.join('\n'),
      inline: false
    });

    embed.setColor(STEP_COLORS[Math.min(index, STEP_COLORS.length - 1)]);
  });

  if (shareUrl) {
    embed.setFooter({ text: `Lien CarrArk: ${shareUrl}` });
  }

  return embed;
}
