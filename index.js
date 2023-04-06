const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

const ownerID = '678695920388538391';
const appID = '1090612293210996797';
const token = 'MTA5MDYxMjI5MzIxMDk5Njc5Nw.Ge9v4l.xr2qQ07qt9QtqP-Mvz1QSCZzi75eRf-PzH7itU';

client.on('ready', () => {
	console.log('DarkDJ is online.');
});

client.on('message', (msg) => {
	if (msg.content === 'HELLO') {
		msg.reply('HELLO FRIEND!');
	}
});

client.login(token);
