const { MessageEmbed } = require('discord.js');

async function getChannels(autopostchannel, serverID) {
  const result = await autopostchannel.findAll({ where: { serverID } });
  return result;
}

async function getBlacklistedTags(servertagsblacklist, serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.functions.blacklistTags.managementServerID] } });
  return result;
}

module.exports.run = async (interaction, autopostchannel, servertagsblacklist) => {
  const DBentries = await getChannels(autopostchannel, interaction.guild.id);
  const embed = new MessageEmbed();
  const blacklistedTagsArray = await getBlacklistedTags(servertagsblacklist, interaction.guild.serverID);
  const suffix = blacklistedTagsArray.map((entry) => `-${entry.tag}`);
  if (DBentries.length === 0) return messageFail(interaction, uwu('There are no autoposts configured.'));
  await DBentries.forEach(async (entry) => {
    const channel = await client.channels.cache.find((channel) => channel.id === entry.channelID);
    embed.addField(`'#${channel.name}' - ${entry.interval}ms`, `\`${entry.tags} ${suffix.join(' ')}\``, false);
  });
  embed
    .setColor('GREEN')
    .setAuthor({ name: 'Autopost channels in this server:' });
  reply(interaction, { embeds: [embed] });
};

module.exports.data = { subcommand: true };
