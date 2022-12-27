const { EmbedBuilder } = require('discord.js');

async function getChannels(autopostfasubmission, serverID) {
  const result = await autopostfasubmission.findAll({ where: { serverID } });
  return result;
}

module.exports.run = async (interaction, autopostfasubmission) => {
  const DBentries = await getChannels(autopostfasubmission, interaction.guild.id);
  const embed = new EmbedBuilder();
  if (DBentries.length === 0) return messageFail(interaction, uwu('There are no autoposts configured.'));
  await DBentries.forEach(async (entry) => {
    const channel = await client.channels.cache.find((channel) => channel.id === entry.channelID);
    embed.addFields([{ name: `#${channel.name}`, value: entry.artistID, inline: true }]);
  });
  embed
    .setColor('Green')
    .setAuthor({ name: 'Autopost channels in this server:' });
  reply(interaction, { embeds: [embed] });
};

module.exports.data = { subcommand: true };
