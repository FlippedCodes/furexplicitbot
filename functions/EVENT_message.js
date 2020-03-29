const { RichEmbed } = require('discord.js');

const credetials = './config/config.json';

function timeout(id, usedRecently) {
  usedRecently.add(id);
  setTimeout(() => {
    usedRecently.delete(id);
  }, 5000);
  // 5sec timeout
}

module.exports.run = async (client, message, config, messageOwner, usedRecently) => {
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
    client.functions.get('FUNC_seenChangelog').run(client, message)
      .catch(console.log);
    if (!usedRecently.has(message.author.id)) {
      timeout(message.author.id, usedRecently);
      cmd.run(client, message, args, config, RichEmbed, messageOwner, credetials.fa_token_A, credetials.fa_token_B)
        .catch(console.log);
    } else {
      message.reply('sowwy, but you can\'t use me that often. Plewse wait 5 secounds between commands.');
    }
  }
};

module.exports.help = {
  name: 'EVENT_message',
};
