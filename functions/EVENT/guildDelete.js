const servertagsblacklist = require('../../database/models/servertagsblacklist');

const autosourcechannel = require('../../database/models/autosourcechannel');

const autopostchannel = require('../../database/models/autopostchannel');

const postcache = require('../../database/models/postcache');

module.exports.run = async (guild) => {
  // Deletes all blacklisted tags
  servertagsblacklist.destroy({ where: { serverID: guild.id } }).catch(ERR);

  // Deletes all autosource channels
  autosourcechannel.destroy({ where: { serverID: guild.id } }).catch(ERR);

  // Deletes all channels and cache for autopost
  const autoChannelEntries = await autopostchannel.findAll({ where: { serverID: guild.id } }).catch(ERR);
  await autoChannelEntries.forEach((entry) => postcache.destroy({ where: { channelID: entry.channelID } }).catch(ERR));
  await autopostchannel.destroy({ where: { serverID: guild.id } }).catch(ERR);
};

module.exports.data = {
  name: 'guildDelete',
};
