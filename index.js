const Discord = require('discord.js');

const { RichEmbed } = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

// const mysql = require('mysql');

const fs = require('fs');

const config = require('./config/main.json');

const usedRecently = new Set();

const messageOwner = new Map();

function timeout(id) {
  usedRecently.add(id);
  setTimeout(() => {
    usedRecently.delete(id);
  }, 5000);
  // 5sec timeout
}

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
  client.functions.get('setup_status').run(client, fs)
    .then(() => console.log('Set status!'));
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (!message.channel.type === 'dm') {
    if (message.mentions.members.first()) {
      if (message.mentions.members.first().id === client.user.id) return message.author.send('>.< You piwned me! uwu. hmm... Maybe you downt know how to uwse me... You can swee all the commands with `+help` that I know. ^w^');
    }
  }
  if (message.content.indexOf(config.prefix) !== 0) return;
  // {
  // if (message.mentions.members.first()) {

  // } else return;
  // }
  // TODO: implement own prefix
  // TODO: bot reacting on ping

  const messageArray = message.content.split(/\s+/g);
  const command = messageArray[0];
  const args = messageArray.slice(1);

  if (!command.startsWith(config.prefix)) return;

  const cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

  if (cmd) {
    // client.functions.get('seenChangelog').run(client, message, DB)
    //   .catch(console.log);
    if (!usedRecently.has(message.author.id)) {
      timeout(message.author.id);
      cmd.run(client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B)
        .catch(console.log);
    } else {
      message.reply('sowwy, but you can\'t use me that often. Plewse wait 5 secounds between commands.');
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  client.functions.get('FUNC_messageReactionAdd').run(client, reaction, user, config, RichEmbed, messageOwner);
});
