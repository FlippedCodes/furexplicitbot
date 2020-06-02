const servertagsblacklist = require('../database/models/servertagsblacklist');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, body) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete(10000));
}

async function addAutopost(tag, serverID, managementServerID) {
  if (await servertagsblacklist.findOne({ where: { serverID: [serverID, managementServerID], tag } }).catch(errHander)) return false;
  await servertagsblacklist.findOrCreate({ where: { serverID, tag } }).catch(errHander);
  return true;
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

async function getTags(message, tags) {
  tags = tagsReplace(tags, ', ', ' ');
  const safeTags = await message.client.functions.get('FUNC_tagsCleanup').run(message, tags);
  return safeTags;
}

module.exports.run = async (client, message, args, config, RichEmbed, prefix) => {
  // check if user can manage servers
  if (!message.member.hasPermission('MANAGE_GUILD')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  const [subcmd, interval, tagCheck] = args;
  if (!interval || !tagCheck) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} ${interval | 'INTERVALINMILLISECONDS'} ${tagCheck | 'TAGNAME'}...\`\`\``);
  }
  if (isNaN(interval)) {
    return messageFail(message,
      `Interval needs to be a number.
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} INTERVALINMILLISECONDS TAGNAME\`\`\``);
  }
  if (interval > config.e621.autopost.maxPostTime || interval < config.e621.autopost.minPostTime) {
    return messageFail(message,
      `Interval needs to be between ${config.e621.autopost.minPostTime} and ${config.e621.autopost.maxPostTime} milliseconds.
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} INTERVALINMILLISECONDS TAGNAME\`\`\``);
  }
  const tags = await getTags(message, args.join(' ').slice(subcmd.length + 1 + interval.length + 1));
  if (tags.length > 255) {
    return messageFail(message, 'Your tags are too long. The maximum length is 255 characters, minus the blacklisted tags in this server.');
  }
  const added = await addAutopost(tags, message.guild.id, config.managementServerID);
  switch (added) {
    case true:
      messageSuccess(message, `Your autopost with the \`${tags}\` has been created. The first post appear soon.`);
      return;
    case 1:
      messageFail(message, 'You already have 2 autopost channels in this server!');
      return;
    case 2:
      messageFail(message, 'You are already using this channel as an autopost channel!');
      return;
    default:
      messageFail(message, 'Woops, seems like the wizard behind the curtain has tripped! Try again later.');
      return;
  }
};

module.exports.help = {
  name: 'CMD_autopost_add',
  parent: 'autopost',
};
