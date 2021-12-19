const config = require('../config/main.json');

const servertagsblacklist = require('../database/models/servertagsblacklist');

const errHander = (err) => {
  console.error('ERROR:', err);
};

async function getTags(serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.managementServerID] } });
  return result;
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

module.exports.run = async (message, tags) => {
  const blacklistedTags = await getTags(message.guild.id);
  const suffix = [];

  blacklistedTags.forEach((entry) => {
    tags = tagsReplace(tags, entry.tag, '');
    suffix.push(` -${entry.tag}`);
  });
  const cleanSuffix = suffix.join('');
  return `${tags}${cleanSuffix}`;
};

module.exports.help = {
  name: 'FUNC_tagsCleanup',
};
