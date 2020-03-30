const { RichEmbed } = require('discord.js');

const credetials = './config/config.json';

function timeout(id, usedRecently, time) {
  usedRecently.add(id);
  setTimeout(() => usedRecently.delete(id), time);
}

module.exports.run = async (client, message, config, messageOwner, usedRecently) => {
  const prefix = await client.functions.get('FUNC_getOwnPrefix').run(message.guild.id);

  let text = message.content;
  if (
    message.channel.type !== 'dm'
    && message.mentions.members.first()
    && message.mentions.members.first().id === client.user.id
  ) {
    text = text.split('>')[1];
    if (text.charAt(0) === ' ') text = text.split(' ')[1];
    if (!text) return message.channel.send(`Hewwo! please try using \`${prefix}help\` and gewt to know mwe! ^^`);
    text = `${config.defaultPrefix}${text}`;
  }

  if (text.indexOf(config.defaultPrefix) !== 0) return;
  // {
  // if (message.mentions.members.first()) {

  // } else return;
  // }
  // TODO: implement own prefix
  // TODO: bot reacting on ping

  const messageArray = text.split(/\s+/g);
  const command = messageArray[0];
  const args = messageArray.slice(1);

  if (!command.startsWith(config.defaultPrefix)) return;

  const cmd = client.commands.get(command.slice(config.defaultPrefix.length).toLowerCase());

  if (cmd) {
    client.functions.get('FUNC_seenChangelog').run(client, message)
      .catch(console.log);
    if (!usedRecently.has(message.author.id)) {
      timeout(message.author.id, usedRecently, 5000);
      cmd.run(client, message, args, config, RichEmbed, messageOwner, credetials.fa_token_A, credetials.fa_token_B)
        .catch(console.log);
    } else {
      message.reply('sowwy, but you can\'t uwse me that owten. Plewse wait 5 seconds between commands.');
    }
  }
};

module.exports.help = {
  name: 'EVENT_message',
};
