const { MessageEmbed } = require('discord.js');

const { Op } = require('sequelize');

const autopostchannel = require('../database/models/autopostchannel');

async function getChannels(currentTimestamp, config) {
  // currentTimestamp += config.e621.autopost.dbOffset;
  const result = await autopostchannel.findAll({ where: { nextEvent: { [Op.lt]: currentTimestamp } } });
  return result;
}

function updateTime(channelID, currentTimestamp, interval) {
  const nextEvent = Number(currentTimestamp) + Number(interval);
  autopostchannel.update({ nextEvent }, { where: { channelID } });
}

function postMessage(post, channel, config) {
  const embed = new MessageEmbed();
  embed
    .setColor(config.e621.color)
    .setTitle(`Artist: ${post.artist} [e621 link]`)
    .setURL(`https://e621.net/posts/${post.postID}`)
    .setImage(post.directLink)
    .setFooter(config.e621.label, config.e621.logo)
    .setTimestamp();
  channel.send({ embed });
}

module.exports.run = (client, config) => {
  setInterval(async () => {
    const date = new Date();
    const currentTimestamp = date.getTime();
    const channels = await getChannels(currentTimestamp, config);
    channels.forEach(async (autoPost) => {
      const channelID = autoPost.channelID;
      const channel = client.channels.cache.find((channel) => channel.id === channelID);
      if (!channel) return console.warn(`ChannelID ${channelID} couldn't be found`);
      const post = await client.functions.get('FUNC_autopostGetPictures').run(autoPost.tags, channel.guild.id, channelID, channel.nsfw);
      postMessage(post, channel, config);
      updateTime(channelID, currentTimestamp, autoPost.interval);
    });
  }, config.e621.autopost.intervalChecker);
};

module.exports.help = {
  name: 'TCKR_autopost',
};
