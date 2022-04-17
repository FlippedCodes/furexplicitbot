const servertagsblacklist = require('../../database/models/servertagsblacklist');

async function getTags(serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.managementServerID] } });
  return result;
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

module.exports.run = async (interaction, tags) => {
  const blacklistedTags = await getTags(interaction.guild.id);
  const suffix = [];

  blacklistedTags.forEach((entry) => {
    tags = tagsReplace(tags, entry.tag, '');
    suffix.push(` -${entry.tag}`);
  });
  const cleanSuffix = suffix.join('');
  return `${tags}${cleanSuffix}`;
};

module.exports.help = {
  name: 'tagsCleanup',
};
