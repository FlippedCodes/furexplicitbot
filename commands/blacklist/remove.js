const postcache = require('../../database/models/postcache');

const autopostchannel = require('../../database/models/autopostchannel');

async function removeTag(servertagsblacklist, id, serverID) {
  if (!await servertagsblacklist.findOne({ where: { serverID, id } }).catch(ERR)) return false;
  await servertagsblacklist.destroy({ where: { serverID, id } }).catch(ERR);
  return true;
}

async function getAutopostChannels(serverID) {
  const result = await autopostchannel.findAll({ attributes: ['channelID'], where: { serverID } });
  return result;
}

// clear autopost to force changes
async function pruneAutopost(serverID) {
  const channelIDs = await getAutopostChannels(serverID);
  channelIDs.forEach(({ channelID }) => postcache.destroy({ where: { channelID } }).catch(ERR));
}

module.exports.run = async (interaction, servertagsblacklist, tag) => {
  const added = await removeTag(servertagsblacklist, tag, interaction.guild.id);
  if (added) {
    // FIXME: LOW: this is a hack to not show tag name in the success and error message. can be fixed by setting the value to the same as the on screen name
    messageSuccess(interaction, 'Tag has been removed from the serwers blacklist.');
    pruneAutopost(interaction.guild.id);
  } else {
    messageFail(interaction, 'This tag doesn\'t exist on the serwers backlist. \n(Keep in mind that we have also globally blocked tags!)');
  }
};

module.exports.data = { subcommand: true };
