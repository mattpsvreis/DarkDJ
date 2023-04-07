const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('clear').setDescription('Limpa a fila de todas as músicas.'),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		queue.tracks.clear();

		await interaction.reply('Fila limpa.');
	},
};
