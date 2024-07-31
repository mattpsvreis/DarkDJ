import {
  Client,
  Collection,
  GatewayIntentBits,
  Routes,
  REST,
  ChannelType,
  PermissionsBitField,
  GuildMember,
  ActivityType,
} from 'discord.js';

import { readdirSync } from 'fs';

import path from 'path';
import 'dotenv/config';
import ExtendedClient from './interfaces/extended-client.js';
import { Player } from 'discord-player';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client: ExtendedClient = Object.assign(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ],
  }),
  {
    commands: new Collection<string, any>(),
  }
);

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith('.ts')
);

const commands: any[] = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { command, execute } = require(filePath);

  if (!command || !execute) {
    console.error(`ERROR: Command or execute function missing in ${file}`);
    continue;
  }

  console.log(`INFO: Loading command ${command.name} from ${file}`);
  client.commands.set(command.name, execute);
  commands.push(command.toJSON());
}

client.player = new Player(client, {
  ytdlOptions: { quality: 'highestaudio', highWaterMark: 1 << 25 },
});

client.player.extractors.loadDefault();

client.player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`Agora tocando: **${track.title}**`);
});

client.once('ready', async () => {
  console.log(`INFO: Logged in as ${client.user?.tag}!`);

  const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_TOKEN as string
  );

  try {
    console.log('INFO: Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(client.user?.id as string), {
      body: commands,
    });

    console.log('INFO: Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('ERROR: ', error);
  }

  client.user?.setPresence({
    activities: [{ name: `\`/play\`!`, type: ActivityType.Listening }],
  });

  client.user?.setStatus('dnd');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!client.commands.has(commandName)) return;

  const execute = client.commands.get(commandName);

  if (execute) {
    try {
      await execute(interaction);
    } catch (error) {
      console.error('ERROR: ', error);
      await interaction.reply({
        content:
          'Ocorreu um erro ao tentar executar este comando! Contate o desenvolvedor: @ryls.dark',
        ephemeral: true,
      });
    }
  }
});

client.on('guildCreate', async (guild) => {
  const channel = guild.channels.cache.find(
    (channel) =>
      ChannelType.GuildText &&
      channel
        .permissionsFor(guild.members.me as GuildMember)
        .has(PermissionsBitField.Flags.SendMessages)
  );

  if (channel && channel.isTextBased()) {
    try {
      await channel.send(
        'Cheguei rapeize. Só pedir música usando /play ou então usar outros comandos!\n\n**Detalhe:** Meus comandos são todos via `/`'
      );
    } catch (error) {
      console.error(
        'ERROR: Unable to send successful join message, but joined successfully!'
      );
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
