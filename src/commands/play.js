"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.command = void 0;
const builders_1 = require("@discordjs/builders");
const command = new builders_1.SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música/playlist via URL (Spotify/YouTube/SoundCloud), ou então pesquisa no YouTube.')
    .addStringOption((option) => {
    return option.setName('query').setDescription('query').setRequired(true);
});
exports.command = command;
const execute = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const member = interaction.member;
    const channel = member.voice.channel;
    if (!channel) {
        console.error('ERROR: Member not connected to a voice channel!');
        yield interaction.reply('Você não está conectado à um canal de voz!');
        return;
    }
    const query = interaction.options.get('query', true).value;
    yield interaction.deferReply();
    if (client.player) {
        try {
            const { track } = yield client.player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                },
                requestedBy: interaction.user,
            });
            return interaction.followUp(`**${track.title}** adicionado à fila!`);
        }
        catch (e) {
            console.error(e);
            return interaction.followUp(`Algo deu errado: ${e}`);
        }
    }
});
exports.execute = execute;
