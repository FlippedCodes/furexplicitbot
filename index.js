const Discord = require('discord.js');

const { RichEmbed } = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const fs = require('fs');

const config = require('./config/config.json');

const usedRecently = new Set();

let messageOwner = new Map();

function timeout(id) {
  usedRecently.add(id);
  setTimeout(() => {
    usedRecently.delete(id);
  }, 5000);
  // 5sec timeout
}

// login
let token;
let clientID;
let fa_token_A;
let fa_token_B;
if (fs.existsSync('./furexplicitbot/config/test_token.json')) {
  token = require('./config/test_token.json');
  client.login(token.test_token_fa);
  clientID = config.clientIDTesting;
  fa_token_A = token.fa_cookie_a;
  fa_token_B = token.fa_cookie_b;
} else {
  client.login(process.env.BOT_TOKEN_FA);
  clientID = config.clientID;
  fa_token_A = process.env.FA_COOKIE_A;
  fa_token_B = process.env.FA_COOKIE_B;
}

client.commands = new Discord.Collection();
fs.readdir('./furexplicitbot/commands/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log('No CMD(s) to load!');
    return;
  }

  console.log(`Loading ${jsfiles.length} command(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`./commands/${f}`);
    console.log(`    ${i + 1}) Loaded: ${f}!`);
    client.commands.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} command(s)!`);
});

// ---------------------

client.functions = new Discord.Collection();
fs.readdir('./furexplicitbot/functions/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log('No function(s) to load!');
    return;
  }

  console.log(`Loading ${jsfiles.length} function(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`./functions/${f}`);
    console.log(`    ${i + 1}) Loaded: ${f}!`);
    client.functions.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} function(s)!`);
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag} serving ${client.guilds.size} Servers!`);

  // set status
  client.functions.get('setup_status').run(client, fs)
    .then(() => console.log('Set status!'));
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.mentions.members.first()) {
    if (message.mentions.members.first().id === client.user.id) return message.author.send('>.< You piwned me! uwu. hmm... Maybe you downt know how to uwse me... You can swee all the commands with `+help` that I know. ^w^');
  }
  if (message.content.indexOf(config.prefix) !== 0) return;
  // {
  // if (message.mentions.members.first()) {

  // } else return;
  // }
  // TODO: implement own prefix
  // TODO: bot reacting on ping

  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(config.prefix)) return;

  let cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

  if (cmd) {
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
  // TODO: image deletion if inapropiete
  if (user.bot) return;
  if (!reaction.me) return;
  client.functions.get('e621_detailed').run(client, reaction, user, config, RichEmbed, fs, messageOwner);
});
