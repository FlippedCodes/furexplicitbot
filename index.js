const Discord = require('discord.js');

const { RichEmbed } = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

// const mysql = require('mysql');

const fs = require('fs');

const config = require('./config/main.json');

const usedRecently = new Set();

const messageOwner = new Map();

// import Functions and Commands
config.setup.startupFunctions.forEach((FCN) => {
  const INIT = require(`./functions/${FCN}.js`);
  INIT.run(client, fs, config);
});

// create conenction to DB
require('./database/SETUP_DBConnection');

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag} serving ${client.guilds.size} Servers!`);

  // set status
  client.functions.get('SETUP_status').run(client, config)
    .then(() => console.log('Set status!'));
});

client.on('message', async (message) => {
  client.functions.get('FUNC_message').run(client, message, config, messageOwner, usedRecently);
});

client.on('messageReactionAdd', async (reaction, user) => {
  client.functions.get('FUNC_messageReactionAdd').run(client, reaction, user, config, RichEmbed, messageOwner);
});
