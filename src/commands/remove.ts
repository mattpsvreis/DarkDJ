import { SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import CommandProps from "../interfaces/commands";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription(
      "Remove uma música específica a partir do número na fila (/queue)."
    )
    .addIntegerOption((options) => {
      return options
        .setName("query")
        .setDescription("número da música na fila")
        .setRequired(true);
    }),
  execute: async ({ interaction }: CommandProps) => {
    const queue = useQueue(interaction.guild?.id as string);
    const query = (interaction.options.get("query", true).value as number) - 1;

    if (!queue) {
      console.error("ERROR: No music in queue!");
      await interaction.reply("Não há nenhuma música tocando.");
      return;
    }

    queue.removeTrack(query);

    await interaction.reply("Música removida com sucesso!");

    console.log("INFO: Music removed!");
  },
};
