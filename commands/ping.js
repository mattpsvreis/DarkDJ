const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Verifica a latência do BOT com a API do Discord.'),
	execute: async ({ client, interaction }) => {
		await interaction.deferReply();

		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		interaction.followUp(`Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`);
	},
};
