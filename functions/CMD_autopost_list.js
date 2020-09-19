const config = require('../config/main.json');

const autopostchannel = require('../database/models/autopostchannel');

async function getChannels(serverID) {
  const result = await autopostchannel.findAll({ where: { serverID } });
  return result;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  const DBentries = await getChannels(message.guild.id);
  const embed = new MessageEmbed();
  await DBentries.forEach(async (entry) => {
    const channel = await client.channels.find((channel) => channel.id === entry.channelID);
    embed.addField(`'#${channel.name}' - ${entry.interval}`, `${entry.tags}`, false);
  });
  embed
    .setColor(message.member.displayColor)
    .setAuthor('Autopost channels in this server:');
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'CMD_autopost_list',
  parent: 'autopost',
};
