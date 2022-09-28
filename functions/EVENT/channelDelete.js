const autosourcechannel = require('../../database/models/autosourcechannel');

const autopostchannel = require('../../database/models/autopostchannel');

const postcache = require('../../database/models/postcache');

module.exports.run = async (channel) => {
  // Deletes channel and cache for autopost
  await postcache.destroy({ where: { channelID: channel.id } }).catch(ERR);
  await autopostchannel.destroy({ where: { channelID: channel.id } }).catch(ERR);

  // Deletes autosource channel
  autosourcechannel.destroy({ where: { channelID: channel.id } }).catch(ERR);
};

module.exports.help = {
  name: 'channelDelete',
};
