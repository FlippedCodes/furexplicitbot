const servertagsblacklist = require('../database/models/servertagsblacklist');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete(10000));
}

async function removeTag(tag, serverID) {
  if (!await servertagsblacklist.findOne({ where: { serverID, tag } }).catch(errHander)) return false;
  await servertagsblacklist.destroy({ where: { serverID, tag } }).catch(errHander);
  return true;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // check if user can manage servers
  if (!message.member.hasPermission('MANAGE_GUILD')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  const [subcmd, tag] = args;
  if (!tag) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} TAGNAME\`\`\``);
  }
  const added = await removeTag(tag, message.guild.id);
  if (added) {
    messageSuccess(message, `\`${tag}\` has been removed from the serwers blacklist.`);
  } else {
    messageFail(message, `\`${tag}\` doesn't exist on the serwers backlist. \n(Keep in mind that we have also globally blocked tags!)`);
  }
};

module.exports.help = {
  name: 'CMD_blacklist_remove',
  parent: 'blacklist',
};
