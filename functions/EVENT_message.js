const { RichEmbed } = require('discord.js');

const credetials = './config/config.json';

function timeout(id, usedRecently, time) {
  usedRecently.add(id);
  setTimeout(() => usedRecently.delete(id), time);
}

  let text = message.content;
  }

  if (text.indexOf(config.prefix) !== 0) return;
  // {
  // if (message.mentions.members.first()) {

  // } else return;
  // }
  // TODO: implement own prefix
  // TODO: bot reacting on ping

  const messageArray = text.split(/\s+/g);
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
