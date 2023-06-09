const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Pula a música atual.'),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		const currentSong = queue.currentTrack;

		queue.node.skip();

		await interaction.reply({
			embeds: [new EmbedBuilder().setDescription(`**${currentSong.title}** pulado!`).setThumbnail(currentSong.thumbnail)],
		});
	},
};
