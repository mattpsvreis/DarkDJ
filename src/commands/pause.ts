import { SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import CommandProps from "../interfaces/commands";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa a música atual."),
  execute: async ({ interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);

    if (!queue) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    queue.node.setPaused(true);

    await interaction.reply("Música pausada.");

    console.log("INFO: Music paused!");
  },
};
