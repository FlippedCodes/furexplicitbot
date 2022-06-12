const postcache = require('../../database/models/postcache');

async function removeTag(servertagsblacklist, id, serverID) {
  if (!await servertagsblacklist.findOne({ where: { serverID, id } }).catch(ERR)) return false;
  await servertagsblacklist.destroy({ where: { serverID, id } }).catch(ERR);
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
