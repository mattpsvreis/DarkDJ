const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('stop').setDescription('Para de tocar todas as músicas e sai da sala.'),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		queue.delete();

		await interaction.reply('Fila limpa e BOT desconectado do canal de voz.');
	},
};
