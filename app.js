
const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");

client.on('ready', () => {
	console.log('Logged in as ${client.user.tag}!');
});

client.on("ready", () => {
    console.log(`Logged in : ${client.user.tag}`);
    client.user.setPresence({
        activity: {
            name: ""
        }
    });

client.on('message', msg => {
	if (msg.content === 'hello') {
	msg.reply('Hello discord!');
	}
});

client.login(token.token);
