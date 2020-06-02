const autopostchannel = require('../database/models/autopostchannel');

const postcache = require('../database/models/postcache');

const errHander = (err) => { console.error('ERROR:', err); };

module.exports.run = async (channel) => {
  // Deletes channel and cache for autopost
  await postcache.destroy({ where: { channelID: channel.id } }).catch(errHander);
  await autopostchannel.destroy({ where: { channelID: channel.id } }).catch(errHander);
};

module.exports.help = {
  name: 'EVENT_channelDelete',
};
