const { MessageEmbed } = require('discord.js');

const config = require('../../config.json');

async function getTags(servertagsblacklist, serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.managementServerID] }, order: [['tag', 'ASC']] });
  return result;
}

module.exports.run = async (interaction, servertagsblacklist) => {
  const DBentries = await getTags(servertagsblacklist, interaction.guild.id);
  const blacklistedTags = DBentries.map((entry) => entry.tag);

  const embed = new MessageEmbed()
    .setColor(0xFAAF3A)
    .setAuthor({ name: uwu('Blacklisted tags in this server:') })
    .setDescription(`• ${blacklistedTags.join('\n• ')}`);
  reply(interaction, { embeds: [embed] });
};

module.exports.data = { subcommand: true };
