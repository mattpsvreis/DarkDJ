const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { useQueue, useHistory } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('previous').setDescription('Volta para música anterior.'),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);
		const history = useHistory(interaction.guild.id);

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		if (!history) {
			await interaction.reply('Não há música no histórico!');
			return;
		}

		await history.previous();

		const currentSong = queue.currentTrack;

		await interaction.reply({
			embeds: [new EmbedBuilder().setDescription(`**${currentSong.title}** tocando novamente!`).setThumbnail(currentSong.thumbnail)],
		});
	},
};
