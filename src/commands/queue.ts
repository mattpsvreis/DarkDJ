import CommandProps from "../interfaces/commands";

import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Mostras as dez primeiras músicas na fila."),
  execute: async ({ interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);

    const currentSong = queue?.currentTrack;

    if (!currentSong) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    const queueString = queue.tracks
      .toArray()
      .slice(0, 10)
      .map((song, i) => {
        if (song.requestedBy) {
          return `${i + 1}. [${song.duration}] \`${song.title}\` - <@${
            song.requestedBy.id
          }>`;
        }
      })
      .join("\n");

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**Tocando Agora:**\n\`${currentSong.title}\` - <@${currentSong.requestedBy?.id}>\n\n**Fila:**\n${queueString}`
          )
          .setThumbnail(currentSong.thumbnail),
      ],
    });

    console.log("INFO: Queue info fetched and displayed!");
  },
};
