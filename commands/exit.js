const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('exit').setDescription('Cleans the queue and forces the BOT to leave the channel.'),
	execute: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guild);

		if (!queue) {
			await interaction.reply('There is no song playing.');
			return;
		}

		queue.destroy();

		await interaction.reply('Queue cleaned and BOT disconnected from voice.');
	},
};
