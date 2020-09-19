const Discord = require('discord.js');

const { MessageEmbed } = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const fs = require('fs');

const config = require('./config/main.json');

const usedRecently = new Set();

const messageOwner = new Map();

// create new collections in client and config
client.functions = new Discord.Collection();
client.commands = new Discord.Collection();
config.env = new Discord.Collection();

// import Functions and Commands
config.setup.startupFunctions.forEach((FCN) => {
  const INIT = require(`./functions/${FCN}.js`);
  INIT.run(client, fs, config);
});

// create conenction to DB
require('./database/SETUP_DBConnection');

// Login the bot
client.login(config.env.get('token'));

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag} serving ${client.guilds.cache.size} Servers!`);

  // start setup Functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(client, config);
  });
});

client.on('message', async (message) => {
  client.functions.get('EVENT_message').run(client, message, config, messageOwner, usedRecently);
});

// trigger on guildDelete
client.on('guildDelete', (guild) => { client.functions.get('EVENT_guildDelete').run(guild); });

// trigger on channelDeletion
client.on('channelDelete', (channel) => { client.functions.get('EVENT_channelDelete').run(channel); });

client.on('messageReactionAdd', async (reaction, user) => {
  client.functions.get('EVENT_messageReactionAdd').run(client, reaction, user, config, MessageEmbed, messageOwner);
});
