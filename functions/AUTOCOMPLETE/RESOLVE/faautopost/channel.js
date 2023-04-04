const { Op } = require('sequelize');

const autopostfasubmission = require('../../../../database/models/autopostfasubmission');

module.exports.run = async (searchInput, serverID) => {
  const DBentries = await autopostfasubmission.findAll({ where: { serverID, artistID: { [Op.substring]: searchInput } }, limit: 25 });

  const output = DBentries.map((entry) => {
    const channel = client.channels.cache.find((channel) => channel.id === entry.channelID);
    return { name: `#${channel.name} - ${entry.artistID}`, value: entry.channelID };
  });
  return output;
};

module.exports.data = {
  name: 'channel',
};
