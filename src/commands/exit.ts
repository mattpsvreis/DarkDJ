import { SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import CommandProps from "../interfaces/commands";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exit")
    .setDescription("Para de tocar todas as músicas e sai da sala."),
  execute: async ({ interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);

    if (!queue) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    queue.delete();

    await interaction.reply("Fila limpa e BOT desconectado do canal de voz.");

    console.log("INFO: Queue cleared and BOT disconnected!");
  },
};
