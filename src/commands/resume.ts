import { SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import CommandProps from "../interfaces/commands";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Despausa a música atual."),
  execute: async ({ interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);

    if (!queue) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    queue.node.setPaused(false);

    await interaction.reply("Música despausada.");

    console.log("INFO: Music resumed!");
  },
};
