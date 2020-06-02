const servertagsblacklist = require('../database/models/servertagsblacklist');

const autopostchannel = require('../database/models/autopostchannel');

const postcache = require('../database/models/postcache');

const errHander = (err) => { console.error('ERROR:', err); };

module.exports.run = async (guild) => {
  // Deletes all blacklisted tags
  servertagsblacklist.destroy({ where: { serverID: guild.id } }).catch(errHander);

  // Deletes all channels and cache for autopost
  const auotChannelEntries = await autopostchannel.findAll({ where: { serverID: guild.id } }).catch(errHander);
  await auotChannelEntries.forEach((entry) => postcache.destroy({ where: { channelID: entry.channelID } }).catch(errHander));
  await autopostchannel.destroy({ where: { serverID: guild.id } }).catch(errHander);
};

module.exports.help = {
  name: 'EVENT_guildDelete',
};
