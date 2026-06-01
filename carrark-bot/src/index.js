import {
  Client,
  GatewayIntentBits,
  Events,
  Collection
} from 'discord.js';
import bodies from './data/bodies.json' with { type: 'json' };
import {
  autocompleteRouteBody,
  buildRouteCommand,
  executeRouteCommand
} from './commands/route.js';
import {
  autocompleteBody,
  buildBodyCommand,
  executeBodyCommand
} from './commands/body.js';
import { buildHelpCommand, executeHelpCommand } from './commands/help.js';

export const commands = [buildRouteCommand(), buildBodyCommand(), buildHelpCommand()];

export function createBotClient(token) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.commands = new Collection();

  client.commands.set('route', {
    execute: (interaction) => executeRouteCommand(interaction, bodies),
    autocomplete: (interaction) => autocompleteRouteBody(interaction, bodies)
  });

  client.commands.set('astre', {
    execute: (interaction) => executeBodyCommand(interaction, bodies),
    autocomplete: (interaction) => autocompleteBody(interaction, bodies)
  });

  client.commands.set('aide', { execute: executeHelpCommand });

  client.once(Events.ClientReady, () => {
    console.log(`CarrArk bot prêt: ${client.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isAutocomplete()) {
      const handler = client.commands.get(interaction.commandName);
      if (handler?.autocomplete) {
        await handler.autocomplete(interaction);
      }
      return;
    }

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const handler = client.commands.get(interaction.commandName);
    if (!handler) {
      return;
    }

    try {
      await handler.execute(interaction);
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({ content: 'Erreur lors de l’exécution de la commande.', ephemeral: true });
      }
    }
  });

  if (token) {
    client.login(token);
  }

  return client;
}
