import bodies from '../data/bodies.json' with { type: 'json' };
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export function buildBodyCommand() {
  return new SlashCommandBuilder()
    .setName('astre')
    .setDescription('Informations sur les astres CarrArk')
    .addSubcommand((sub) =>
      sub
        .setName('info')
        .setDescription('Affiche les informations d’un astre')
        .addStringOption((opt) =>
          opt.setName('nom').setDescription('Nom de l’astre').setRequired(true).setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('liste')
        .setDescription('Liste les astres disponibles')
        .addStringOption((opt) =>
          opt.setName('systeme').setDescription('Filtrer par système').addChoices(
            { name: 'Stanton', value: 'Stanton' },
            { name: 'Pyro', value: 'Pyro' },
            { name: 'Nyx', value: 'Nyx' }
          )
        )
    );
}

export async function autocompleteBody(interaction, bodyCatalog = bodies) {
  const focused = interaction.options.getFocused().toLowerCase();
  const choices = bodyCatalog
    .filter((body) => body.name.toLowerCase().includes(focused))
    .slice(0, 25)
    .map((body) => ({ name: `${body.name} (${body.system})`, value: body.name }));

  await interaction.respond(choices);
}

export async function executeBodyCommand(interaction, bodyCatalog = bodies) {
  const sub = interaction.options.getSubcommand();

  if (sub === 'info') {
    const name = interaction.options.getString('nom', true);
    const body = bodyCatalog.find((entry) => entry.name === name);

    if (!body) {
      await interaction.reply({ content: `Astre introuvable: ${name}`, ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${body.name} (${body.system})`)
      .setColor(0xfada7d)
      .addFields(
        { name: 'Type', value: body.type, inline: true },
        { name: 'Rayon astre', value: `${body.bodyRadiusKm} km`, inline: true },
        { name: 'Rayon OM', value: `${body.orbitalMarkerRadiusKm} km`, inline: true },
        { name: 'Parent', value: body.parentBody || 'Aucun', inline: true },
        { name: 'Variants', value: body.variants.join(', '), inline: true }
      );

    await interaction.reply({ embeds: [embed] });
    return;
  }

  const system = interaction.options.getString('systeme');
  const list = system ? bodyCatalog.filter((body) => body.system === system) : bodyCatalog;

  const lines = list.map((body) => `• ${body.name} (${body.type})`).join('\n');
  await interaction.reply({ content: lines || 'Aucun astre trouvé.' });
}
