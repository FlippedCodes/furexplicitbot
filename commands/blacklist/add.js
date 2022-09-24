const postcache = require('../../database/models/postcache');

async function addTag(servertagsblacklist, tag, serverID, managementServerID) {
  if (await servertagsblacklist.findOne({ where: { serverID: [serverID, managementServerID], tag } }).catch(ERR)) return false;
  await servertagsblacklist.findOrCreate({ where: { serverID, tag } }).catch(ERR);
  return true;
}

// clear autopost to force changes
function pruneAutopost(channelID) {
  postcache.destroy({ where: { channelID } }).catch(ERR);
}

module.exports.run = async (interaction, servertagsblacklist, tag) => {
  if (tag.length > 30) {
    return messageFail(interaction, uwu('Your tag is too long. The maximum length is ßß30 characters.'));
  }
  const mgmtServer = config.functions.blacklistTags.managementServerID;
  const added = await addTag(servertagsblacklist, tag, interaction.guild.id, mgmtServer);
  if (added) {
    messageSuccess(interaction, uwu(`ßß\`${tag}\` has been added to the servers blacklist.`));
    pruneAutopost(interaction.channel.id);
  } else {
    messageFail(interaction, uwu(`ßß\`${tag}\` is already added to this servers backlist.`));
  }
};

module.exports.data = { subcommand: true };
