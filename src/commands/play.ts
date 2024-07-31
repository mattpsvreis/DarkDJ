import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ExtendedClient from '../interfaces/extended-client.js';

const command = new SlashCommandBuilder()
  .setName('play')
  .setDescription(
    'Toca uma música/playlist via URL (Spotify/YouTube/SoundCloud), ou então pesquisa no YouTube.'
  )
  .addStringOption((option) => {
    return option.setName('query').setDescription('query').setRequired(true);
  });

const execute = async (
  client: ExtendedClient,
  interaction: CommandInteraction
) => {
  const member = interaction.member as GuildMember;

  const channel = member.voice.channel;

  if (!channel) {
    console.error('ERROR: Member not connected to a voice channel!');

    await interaction.reply('Você não está conectado à um canal de voz!');

    return;
  }

  const query = interaction.options.get('query', true).value as string;

  await interaction.deferReply();

  if (client.player) {
    try {
      const { track } = await client.player.play(channel, query, {
        nodeOptions: {
          metadata: interaction,
        },
        requestedBy: interaction.user,
      });
      return interaction.followUp(`**${track.title}** adicionado à fila!`);
    } catch (e) {
      console.error(e);
      return interaction.followUp(`Algo deu errado: ${e}`);
    }
  }
};

export { command, execute };
