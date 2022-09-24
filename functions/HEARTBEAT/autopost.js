const { MessageEmbed } = require('discord.js');

const { Op } = require('sequelize');

const autopostchannel = require('../../database/models/autopostchannel');

// const postcache = require('../database/models/postcache');

// // clear autopost to force changes
// function pruneAutopost(channelID) {
//   postcache.destroy({ where: { channelID } }).catch(ERR);
// }

async function getChannels(currentTimestamp) {
  const result = await autopostchannel.findAll({ where: { nextEvent: { [Op.lt]: currentTimestamp } } });
  // const result = await autopostchannel.findAll();
  return result;
}

function updateTime(channelID, currentTimestamp, interval) {
  const nextEvent = Number(currentTimestamp) + Number(interval);
  autopostchannel.update({ nextEvent }, { where: { channelID } });
}

function postMessage(post, channel) {
  const embed = new MessageEmbed();
  embed
    .setColor(config.engine.e621.color)
    .setTitle(`Artist: ${post.artist} [e621 link]`)
    .setURL(`https://e621.net/posts/${post.postID}`)
    .setImage(post.directLink)
    .setFooter({ text: 'Picture from e621.net', iconURL: config.engine.e621.logo })
    .setTimestamp();
  channel.send({ embeds: [embed] });
}

module.exports.run = () => {
  setInterval(async () => {
    const currentTimestamp = new Date();
    const channels = await getChannels(currentTimestamp);
    channels.forEach(async (autoPost) => {
      const channelID = autoPost.channelID;
      const channel = client.channels.cache.find((channel) => channel.id === channelID);
      if (!channel) return console.warn(`[${currentShardID}] ChannelID ${channelID} couldn't be found`);
      const shardID = channel.guild.shardId;
      if (currentShardID !== shardID) return;
      // TODO: check if nsfw channel changed and delete cache
      // if ()
      const post = await client.functions.get('ENGINE_E621_autopost_getPictures').run(autoPost.tags, channel.guild.id, channelID, channel.nsfw);
      // tags, channelID, nsfw
      postMessage(post, channel);
      updateTime(channelID, currentTimestamp, autoPost.interval);
    });
  }, config.commands.autopost.intervalChecker);
};

module.exports.help = {
  name: 'autopost',
};
