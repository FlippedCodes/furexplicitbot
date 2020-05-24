const servertagsblacklist = require('../database/models/servertagsblacklist');

const errHander = (err) => { console.error('ERROR:', err); };

module.exports.run = async (guild) => {
  // Deletes all blacklisted tags
  servertagsblacklist.destroy({ where: { serverID: guild.id } }).catch(errHander);
};

module.exports.help = {
  name: 'EVENT_guildDelete',
};
