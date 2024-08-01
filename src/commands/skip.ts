import CommandProps from "../interfaces/commands";

import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pula a música atual."),
  execute: async ({ client, interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);

    const currentSong = queue?.currentTrack;

    if (!currentSong) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    queue.node.skip();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`**${currentSong.title}** pulado!`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });

    console.log("INFO: Music skipped!");
  },
};
