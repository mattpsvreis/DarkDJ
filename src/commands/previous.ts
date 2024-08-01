import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { useQueue, useHistory, Track } from "discord-player";
import CommandProps from "../interfaces/commands";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Volta para música anterior."),
  execute: async ({ interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);
    const history = useHistory(interaction.guild?.id as string);

    const currentSong = queue?.currentTrack;

    if (!currentSong) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    if (!history) {
      console.error("ERROR: No history in queue!");
      await interaction.reply("Não há música no histórico!");
      return;
    }

    await history.previous();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`**${currentSong.title}** tocando novamente!`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });

    console.log("INFO: Playing previous song!");
  },
};
