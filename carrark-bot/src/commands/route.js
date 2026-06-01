import bodies from '../data/bodies.json' with { type: 'json' };
import { buildOMVectors } from '../core/omGeometry.js';
import { planRoute } from '../core/routePlanner.js';
import { resolveTarget } from '../core/targetResolver.js';
import { validateRouteInput } from '../core/validation.js';
import { buildRouteEmbed } from '../formatters/embed.js';
import { generateShareLink } from '../formatters/shareLink.js';
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

const OM_KEYS = ['om1', 'om2', 'om3', 'om4', 'om5', 'om6'];

export function buildRouteCommand() {
  const command = new SlashCommandBuilder()
    .setName('route')
    .setDescription('Calculer un itinéraire CarrArk vers un POI surface')
    .addSubcommand((sub) =>
      sub
        .setName('calculer')
        .setDescription('Calcule un itinéraire à partir de 3+ distances OM')
        .addStringOption((opt) =>
          opt.setName('astre').setDescription('Nom de l’astre').setRequired(true).setAutocomplete(true)
        )
        .addStringOption((opt) => opt.setName('titre').setDescription('Titre du trajet'))
    );

  OM_KEYS.forEach((key) => {
    command.options[0].addNumberOption((opt) =>
      opt.setName(key).setDescription(`Distance ${key.toUpperCase()} (km)`).setMinValue(0.1)
    );
  });

  return command;
}

export async function autocompleteRouteBody(interaction, bodyCatalog = bodies) {
  const focused = interaction.options.getFocused().toLowerCase();
  const choices = bodyCatalog
    .filter((body) => body.name.toLowerCase().includes(focused))
    .slice(0, 25)
    .map((body) => ({ name: `${body.name} (${body.system})`, value: body.name }));

  await interaction.respond(choices);
}

export async function executeRouteCommand(interaction, bodyCatalog = bodies) {
  const bodyName = interaction.options.getString('astre', true);
  const title = interaction.options.getString('titre') || `Route ${bodyName}`;

  const body = bodyCatalog.find((entry) => entry.name === bodyName);
  if (!body) {
    await interaction.reply({ content: `Astre introuvable: ${bodyName}`, ephemeral: true });
    return;
  }

  const omDistances = {};
  OM_KEYS.forEach((key) => {
    const value = interaction.options.getNumber(key);
    if (Number.isFinite(value)) omDistances[key] = value;
  });

  const validation = validateRouteInput({
    distance: body.orbitalMarkerRadiusKm,
    size: body.bodyRadiusKm,
    omDistances
  });

  if (!validation.valid) {
    await interaction.reply({ content: validation.error, ephemeral: true });
    return;
  }

  const target = resolveTarget({
    omDistances,
    orbitalMarkerRadiusKm: body.orbitalMarkerRadiusKm,
    bodyRadiusKm: body.bodyRadiusKm
  });

  if (!target.success) {
    await interaction.reply({ content: target.error, ephemeral: true });
    return;
  }

  const routePlan = planRoute({
    targetPosition: target.position,
    omVectors: buildOMVectors(body.orbitalMarkerRadiusKm)
  });

  const shareUrl = generateShareLink({
    title,
    size: body.bodyRadiusKm,
    distance: body.orbitalMarkerRadiusKm,
    omDistances: routePlan.omDistanceMap
  });

  const embed = buildRouteEmbed({
    title,
    body,
    routePlan,
    shareUrl
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Ouvrir dans CarrArk').setURL(shareUrl)
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}
