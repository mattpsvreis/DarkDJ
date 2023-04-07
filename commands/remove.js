const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove uma música específica a partir do número na fila (/queue).')
		.addIntegerOption((options) => {
			return options.setName('query').setDescription('número da música na fila').setRequired(true);
		}),
	execute: async ({ client, interaction }) => {
		const queue = useQueue(interaction.guild.id);
    const query = interaction.options.getInteger('query', true) - 1;

		if (!queue) {
			await interaction.reply('Não há nenhuma música tocando.');
			return;
		}

		queue.removeTrack(query);

		await interaction.reply('Música removida com sucesso!');
	},
};
