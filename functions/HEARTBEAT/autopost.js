const { MessageEmbed } = require('discord.js');

const { Op } = require('sequelize');

const autopostchannel = require('../../database/models/autopostchannel');

// const postcache = require('../database/models/postcache');

// // clear autopost to force changes
// function pruneAutopost(channelID) {
//   postcache.destroy({ where: { channelID } }).catch(ERR);
// }

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
    .setFooter({ text: config.e621.label, iconURL: config.e621.logo })
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
      const shardID = channel.guild.shardId;
      if (currentShardID !== shardID) return;
      if (!channel) return console.warn(`ChannelID ${channelID} couldn't be found`);
      // TODO: check if nsfw channel changed and delete cache
      // if ()
      const post = await client.functions.get('ENGINE_E621_autopost_getPictures').run(autoPost.tags, channel.guild.id, channelID, channel.nsfw);
      // tags, channelID, nsfw
      postMessage(post, channel, config);
      updateTime(channelID, currentTimestamp, autoPost.interval);
    });
  }, config.e621.autopost.intervalChecker);
};

module.exports.help = {
  name: 'autopost',
};
