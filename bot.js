// init Discord
const { Client, Intents, Collection } = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// init p-queue for setup functions, bcause no await
const { default: PQueue } = require('p-queue');
// setting essential global values; additional global values are set in the globalfunc.js file
// init Discord client
global.client = new Client({
  disableEveryone: true,
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
  ],
});
// init config
global.config = require('./config.json');
global.config.package = require('./package.json');

global.DEBUG = process.env.NODE_ENV === 'development';

global.CmdBuilder = SlashCommandBuilder;

global.ERR = (err) => {
  console.error('ERROR:', err);
  if (DEBUG) return;
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .setAuthor({ name: `Error: '${err.message}'` })
    .setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
    .setColor('RED');
  client.channels.cache.get(config.logChannel).send({ embeds: [embed] });
  return;
};

// creating collections and sets
client.commands = new Collection();
client.functions = new Collection();
const usedRecentlyReactions = new Set();
const messageOwner = new Map();

// anouncing debug mode
if (DEBUG) console.log(`[${config.package.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

(async () => {
  // startup functions in order
  const startupQueue = new PQueue({ concurrency: 1 });
  const files = await fs.readdirSync('./functions/STARTUP');
  files.forEach((FCN) => {
    startupQueue.add(async () => {
      if (!FCN.endsWith('.js')) return;
      const INIT = require(`./functions/STARTUP/${FCN}`);
      await INIT.run(fs);
    });
  });

  // When done: Login the bot
  await client.login(process.env.token_discord);
})();

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.package.name}] Logged in as "${client.user.tag}"!`);

  // run setup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run();
  });
});

// // trigger on guildDelete
client.on('guildDelete', (guild) => client.functions.get('EVENT_guildDelete').run(guild));

// trigger on channelDeletion
client.on('channelDelete', (channel) => client.functions.get('EVENT_channelDelete').run(channel));

// client.on('messageReactionAdd', async (reaction, user) => {
//   client.functions.get('EVENT_messageReactionAdd').run(client, reaction, user, config, MessageEmbed, messageOwner, usedRecentlyReactions);
// });

// TEMP: message Event gets removed once interactions are implemented on discord side
client.on('messageCreate', (message) => client.functions.get('EVENT_messageCreate').run(message));

// itneraction is triggered (command, autocomplete, etc.)
client.on('interactionCreate', (interaction) => client.functions.get('EVENT_interactionCreate').run(interaction));

// logging errors and warns
client.on('error', (ERR));
client.on('warn', (ERR));
process.on('uncaughtException', (ERR));