const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('queue').setDescription('Mostras as dez primeiras músicas na fila.'),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		const queueString = queue.tracks.toArray()
			.slice(0, 10)
			.map((song, i) => {
				return `${i + 1}. [${song.duration}]\` ${song.title}\``;
			})
			.join('\n');

		const currentSong = queue.currentTrack;

		console.log(currentSong);

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setDescription(
						`**Tocando Agora:**\n\` ${currentSong.title}\`\n\n**Fila:**\n${queueString}`
					)
					.setThumbnail(currentSong.thumbnail),
			],
		});
	},
};
