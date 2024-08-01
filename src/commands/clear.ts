import { SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import CommandProps from "../interfaces/commands";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Limpa a fila de todas as músicas."),
  execute: async ({ interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);

    if (!queue) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    queue.tracks.clear();

    await interaction.reply("Fila limpa.");

    console.log("INFO: Queue cleared!");
  },
};
