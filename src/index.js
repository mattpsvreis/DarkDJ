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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const discord_player_1 = require("discord-player");
const client = Object.assign(new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
}), {
    commands: new discord_js_1.Collection(),
});
client.commands = new discord_js_1.Collection();
const commandsPath = path_1.default.join(__dirname, 'commands');
const commandFiles = (0, fs_1.readdirSync)(commandsPath).filter((file) => file.endsWith('.ts'));
const commands = [];
for (const file of commandFiles) {
    const filePath = path_1.default.join(commandsPath, file);
    const { command, execute } = require(filePath);
    client.commands.set(command.name, execute);
    commands.push(command.toJSON());
}
client.player = new discord_player_1.Player(client, {
    ytdlOptions: { quality: 'highestaudio', highWaterMark: 1 << 25 },
});
client.player.extractors.loadDefault();
client.player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`Agora tocando: **${track.title}**`);
});
client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log(`INFO: Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log('INFO: Started refreshing application (/) commands.');
        yield rest.put(discord_js_1.Routes.applicationCommands((_b = client.user) === null || _b === void 0 ? void 0 : _b.id), {
            body: commands,
        });
        console.log('INFO: Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error('ERROR: ', error);
    }
    (_c = client.user) === null || _c === void 0 ? void 0 : _c.setPresence({
        activities: [{ name: `\`/play\`!`, type: discord_js_1.ActivityType.Listening }],
    });
    (_d = client.user) === null || _d === void 0 ? void 0 : _d.setStatus('dnd');
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    if (!client.commands.has(commandName))
        return;
    const execute = client.commands.get(commandName);
    if (execute) {
        try {
            yield execute(interaction);
        }
        catch (error) {
            console.error('ERROR: ', error);
            yield interaction.reply({
                content: 'Ocorreu um erro ao tentar executar este comando! Contate o desenvolvedor: @ryls.dark',
                ephemeral: true,
            });
        }
    }
}));
client.on('guildCreate', (guild) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = guild.channels.cache.find((channel) => discord_js_1.ChannelType.GuildText &&
        channel
            .permissionsFor(guild.members.me)
            .has(discord_js_1.PermissionsBitField.Flags.SendMessages));
    if (channel && channel.isTextBased()) {
        try {
            yield channel.send('Cheguei rapeize. Só pedir música usando /play ou então usar outros comandos!\n\n**Detalhe:** Meus comandos são todos via `/`');
        }
        catch (error) {
            console.error('ERROR: Unable to send successful join message, but joined successfully!');
        }
    }
}));
client.login(process.env.DISCORD_TOKEN);
