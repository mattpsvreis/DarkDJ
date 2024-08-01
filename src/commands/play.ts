import { SlashCommandBuilder } from "@discordjs/builders";
import CommandProps from "../interfaces/commands";
import { GuildMember } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Toca uma música/playlist via URL (Spotify/YouTube/etc), ou então pesquisa a sua query no YouTube."
    )
    .addStringOption((option) => {
      return option.setName("query").setDescription("query").setRequired(true);
    }),
  execute: async ({ client, interaction }: CommandProps) => {
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel;

    if (!channel) {
      console.error("ERROR: User not connected to a voice channel!");
      return interaction.reply("Você não está conectado à um canal de voz!");
    }

    const query = interaction.options.get("query", true).value as string;

    await interaction.deferReply();

    if (client.player) {
      try {
        const { track } = await client.player.play(channel, query, {
          nodeOptions: {
            metadata: interaction,
          },
          requestedBy: interaction.user,
        });

        console.log(
          "INFO: Now playing:",
          track.title,
          "\nINFO: Requested by:",
          interaction.user.tag
        );

        return interaction.followUp(`**${track.title}** adicionado à fila!`);
      } catch (err) {
        console.error("ERROR:", err);
        return interaction.followUp(`Algo deu errado: ${err}`);
      }
    } else {
      console.error("ERROR: Player not initialized!");
    }
  },
};
