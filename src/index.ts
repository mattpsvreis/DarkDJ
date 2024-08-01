require("dotenv").config();

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import {
  Client,
  GatewayIntentBits,
  Collection,
  PermissionsBitField,
  ChannelType,
  ActivityType,
  GuildMember,
} from "discord.js";
import { Player } from "discord-player";

import fs from "node:fs";
import path from "node:path";
import ExtendedClient from "./interfaces/extended-client";
import { YoutubeiExtractor } from "discord-player-youtubei";

const client: ExtendedClient = Object.assign(
  new Client({
    intents: [
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.Guilds,
    ],
  }),
  { commands: new Collection<string, any>() }
);

const commands: any[] = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor");
client.player.extractors.register(YoutubeiExtractor, {});

client.player.events.on("playerStart", (queue, track) => {
  queue.metadata.channel.send(`Agora tocando **${track.title}**!`);
});

client.on("ready", () => {
  const rest = new REST({ version: "9" }).setToken(
    process.env.DISCORD_TOKEN as string
  );

  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID as string), {
      body: commands,
    })
    .then(() => console.log(`Commands table populated!`))
    .catch(console.error);

  if (client.user) {
    client.user.setPresence({
      activities: [{ name: `\`/play\`!`, type: ActivityType.Listening }],
    });

    client.user.setStatus("dnd");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute({ client, interaction });
  } catch (err) {
    console.error(err);
    await interaction.reply("Ocorreu um erro ao executar o comando.");
  }
});

client.on("guildCreate", (guild) => {
  const channel = guild.channels.cache.find(
    (channel) =>
      ChannelType.GuildText &&
      channel
        .permissionsFor(guild.members.me as GuildMember)
        .has(PermissionsBitField.Flags.SendMessages)
  );

  if (channel && channel.isTextBased()) {
    channel.send(
      "Cheguei rapeize. Só pedir música usando /play ou então usar outros comandos!\n\n**Detalhe:** Meus comandos são todos via `/`"
    );
  } else {
    console.error(
      "Unable to send successful join message, but joined successfully!"
    );
  }
});

client.login(process.env.TOKEN);
