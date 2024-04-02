const postcache = require('../../database/models/postcache');

const autopostchannel = require('../../database/models/autopostchannel');

async function addTag(servertagsblacklist, tag, serverID, managementServerID) {
  if (await servertagsblacklist.findOne({ where: { serverID: [serverID, managementServerID], tag } }).catch(ERR)) return false;
  await servertagsblacklist.findOrCreate({ where: { serverID, tag } }).catch(ERR);
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
  let tagNew = tag;
  if (tagNew.length > 30) {
    return messageFail(interaction, uwu('Your tag is too long. The maximum length is ßß30 characters.'));
  }
  const minus = tagNew.match(/^-.*/gm);
  if (minus) tagNew = tagNew.replace('-', '');
  tagNew = tagNew.replaceAll(' ', '_');
  const mgmtServer = config.functions.blacklistTags.managementServerID;
  const added = await addTag(servertagsblacklist, tagNew, interaction.guild.id, mgmtServer);
  if (added) {
    messageSuccess(interaction, uwu(`ßß\`${tagNew}\` has been added to the servers blacklist.`));
    pruneAutopost(interaction.guild.id);
  } else {
    messageFail(interaction, uwu(`ßß\`${tagNew}\` is already added to this servers backlist.`));
  }
};

module.exports.data = { subcommand: true };
