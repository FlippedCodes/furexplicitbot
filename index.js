// init Discord
const { Client, Intents, Collection } = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// init p-queue for setup functions, bcause no await
const { default: PQueue } = require('p-queue');
// setting essential global values
// init Discord client
global.client = new Client({
  disableEveryone: true,
  intents: [Intents.FLAGS.GUILDS],
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
const usedRecentlyMessages = new Set();
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
// client.on('guildDelete', (guild) => { client.functions.get('EVENT_guildDelete').run(guild); });

// // trigger on channelDeletion
// client.on('channelDelete', (channel) => { client.functions.get('EVENT_channelDelete').run(channel); });

// client.on('messageReactionAdd', async (reaction, user) => {
//   client.functions.get('EVENT_messageReactionAdd').run(client, reaction, user, config, MessageEmbed, messageOwner, usedRecentlyReactions);
// });

client.on('interactionCreate', async (interaction) => {
  // only guild command
  if (!await interaction.inGuild()) return messageFail(interaction, uwu('The bot is for server-use only.'));

  // autocomplete hanlder
  // if (interaction.isAutocomplete()) return client.functions.get('EVENT_autocomplete').run(interaction).catch(ERR);
  // command handler
  if (interaction.isCommand()) {
    // TODO: cleanup code to own event function
    const mainCMD = interaction.commandName.replace('_dev', '');
    const command = client.commands.get(DEBUG ? mainCMD : interaction.commandName);
    if (command) {
      // if debuging trigger application thinking
      // TEMP: set to false to test some public commands
      if (DEBUG) await interaction.deferReply({ ephemeral: false });
      command.run(interaction).catch(ERR);
      return;
    }
  }
});

// logging errors and warns
client.on('error', (ERR));
client.on('warn', (ERR));
process.on('uncaughtException', (ERR));
