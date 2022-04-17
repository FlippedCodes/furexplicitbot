const postcache = require('../../database/models/postcache');

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
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function removeTag(tag, serverID) {
  if (!await servertagsblacklist.findOne({ where: { serverID, tag } }).catch(ERR)) return false;
  await servertagsblacklist.destroy({ where: { serverID, tag } }).catch(ERR);
  return true;
}

// clear autopost to force changes
function pruneAutopost(channelID) {
  postcache.destroy({ where: { channelID } }).catch(ERR);
}

module.exports.run = async (interaction, servertagsblacklist, tag) => {
  const added = await removeTag(tag, interaction.guild.id);
  if (added) {
    messageSuccess(interaction, `\`${tag}\` has been removed from the serwers blacklist.`);
    pruneAutopost(interaction.channel.id);
  } else {
    messageFail(interaction, `\`${tag}\` doesn't exist on the serwers backlist. \n(Keep in mind that we have also globally blocked tags!)`);
  }
};

module.exports.data = { subcommand: true };
