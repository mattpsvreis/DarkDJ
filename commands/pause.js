const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('pause').setDescription('Pausa a música atual.'),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		queue.node.setPaused(true);

		await interaction.reply('Música pausada.');
	},
};
