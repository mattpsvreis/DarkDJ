const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Skips the current song.'),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		const currentSong = queue.currentTrack;

		queue.node.skip();

		await interaction.reply({
			embeds: [new EmbedBuilder().setDescription(`Skipped **${currentSong.title}**`).setThumbnail(currentSong.thumbnail)],
		});
	},
};
