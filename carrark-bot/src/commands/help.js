import { SlashCommandBuilder } from 'discord.js';

export function buildHelpCommand() {
  return new SlashCommandBuilder()
    .setName('aide')
    .setDescription('Afficher l’aide CarrArk Bot');
}

export async function executeHelpCommand(interaction) {
  await interaction.reply({
    content:
      'Commandes disponibles:\n' +
      '• /route calculer astre:<nom> om1..om6\n' +
      '• /astre info nom:<nom>\n' +
      '• /astre liste [systeme]'
  });
}
