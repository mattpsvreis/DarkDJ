import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong! (and ms latency)");

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
};

export { command, execute };
