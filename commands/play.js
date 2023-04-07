const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Toca um música via URL ou pesquisa no YouTube.')
		.addStringOption((option) => {
			return option.setName('query').setDescription('query').setRequired(true);
		}),
	execute: async ({ client, interaction }) => {
		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const channel = member.voice.channel;

		if (!channel) {
			return interaction.reply('Você não está conectado à um canal de voz!');
		}

		const query = interaction.options.getString('query', true);

		await interaction.deferReply();

		try {
			const { track } = await client.player.play(channel, query, {
				nodeOptions: {
					metadata: interaction,
				},
			});
			return interaction.followUp(`**${track.title}** adicionado à fila!`);
		} catch (e) {
			console.error(e);
			return interaction.followUp(`Algo deu errado: ${e}`);
		}
	},
};
