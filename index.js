const Discord = require('discord.js');

const { RichEmbed } = require('discord.js');

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
  console.log(`Logged in as ${client.user.tag} serving ${client.guilds.size} Servers!`);

  // set status
  client.functions.get('SETUP_status').run(client, config)
    .then(() => console.log('Set status!'));
});

client.on('message', async (message) => {
  client.functions.get('EVENT_message').run(client, message, config, messageOwner, usedRecently);
});

client.on('messageReactionAdd', async (reaction, user) => {
  client.functions.get('EVENT_messageReactionAdd').run(client, reaction, user, config, RichEmbed, messageOwner);
});
