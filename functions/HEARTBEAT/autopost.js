const { EmbedBuilder, PermissionsBitField, Colors } = require('discord.js');

const { Op } = require('sequelize');

const autopostchannel = require('../../database/models/autopostchannel');

const postcache = require('../../database/models/postcache');

// // clear autopost to force changes
// function pruneAutopost(channelID) {
//   postcache.destroy({ where: { channelID } }).catch(ERR);
// }

function notAgeRestricted(channel, channelID, currentTimestamp, autoPostInterval) {
  const title = 'Hello! Your channel not marked as ßßage-restricted (NSFW).';
  const body = 'To further comply with discords guidelines, the bot will not post any art in any unmarked channel. \nMake sure to adjust the setting. If you prefer to only get SFW posts, add `rating:safe` to your tags.';
  return abortMessage(channel, channelID, currentTimestamp, autoPostInterval, title, body);
}

function notSuccessfullyPosted(channel) {
  const title = 'Hello! There are no pictures!';
  const body = `We are sorry to inform you, but in an attempt to keep unnecessary requests to e621 to a minimum, we deleted your autopost in this channel, as we are not able to find any pictures with your tags for over a week.
Please review your tags and try again with \`/autopost\`. Thank you for understanding :3`;
  return abortMessage(channel, null, null, null, title, body);
}

// abort posting as channel is sfw
function abortMessage(channel, channelID, currentTimestamp, autoPostInterval, title, body) {
  const embed = new EmbedBuilder();
  embed
    .setColor(Colors.Red)
    .setDescription(body)
    .setTitle(title);
  channel.send({ embeds: [embed] });
  if (channelID && currentTimestamp && autoPostInterval) updateTime(channelID, currentTimestamp, autoPostInterval);
}

async function getChannels() {
  const result = await autopostchannel.findAll({ where: { nextEvent: { [Op.lt]: new Date() } } });
  // const result = await autopostchannel.findAll();
  return result;
}

// if not posted in over a week, delete autopost and cache.
async function cleanupAutopostChannels() {
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);
  const result = await autopostchannel.findAll({ where: { nextEvent: { [Op.lt]: aWeekAgo } } }).catch(ERR);
  result.forEach(async (autoPost) => {
    const channelID = autoPost.channelID;
    const channel = client.channels.cache.find((channel) => channel.id === channelID);
    if (channel) notSuccessfullyPosted(channel);
    postcache.destroy({ where: { channelID } }).catch(ERR);
    autopostchannel.destroy({ where: { channelID } }).catch(ERR);
  });
}

function updateTime(channelID, currentTimestamp, interval) {
  const nextEvent = Number(currentTimestamp) + Number(interval);
  autopostchannel.update({ nextEvent }, { where: { channelID } });
}

function postMessage(post, channel) {
  const embed = new EmbedBuilder();
  embed
    .setColor(config.engine.e621.color)
    .setTitle(`Artist: ${post.artist} [e621 link]`)
    .setURL(`https://e621.net/posts/${post.postID}`)
    .setImage(post.directLink)
    .setFooter({ text: 'Picture from e621.net', iconURL: config.engine.e621.logo })
    .setTimestamp();
  channel.send({ embeds: [embed] });
}

async function main() {
  await cleanupAutopostChannels();
  const channels = await getChannels();
  channels.forEach(async (autoPost) => {
    const channelID = autoPost.channelID;
    const channel = client.channels.cache.find((channel) => channel.id === channelID);
    if (!channel) {
      // const shardOut = await client.shard.fetchClientValues(`channels.cache.get('${channelID}')`);
      // console.log(shardOut);
      // if (!shardOut.length) console.warn(`[${currentShardID}] ChannelID ${channelID} couldn't be found`);
      return;
    }
    // check, if bot has permission to send messages
    if (!channel.guild.members.me.permissionsIn(channel).has(new PermissionsBitField(['SendMessages', 'ViewChannel']))) {
      // DISABLED: console spam, needed to update in the future. Result of sharding
      // console.warn(`[${currentShardID}] ChannelID ${channelID} has no permissions`);
      return;
    }

    if (!channel.nsfw && !config.functions.allowSFWChannels) return notAgeRestricted(channel, channelID, new Date(), autoPost.interval);
    // const shardID = channel.guild.shardId;
    // if (currentShardID !== shardID) return;
    const post = await client.functions.get('ENGINE_E621_autopost_getPictures').run(autoPost.tags, channel.guild.id, channelID, channel.nsfw);
    if (!post) return console.warn(`[${currentShardID}] No pictures available for ${channelID}!`);
    // tags, channelID, nsfw
    postMessage(post, channel);
    updateTime(channelID, new Date(), autoPost.interval);
  });
}

module.exports.run = () => {
  setInterval(() => main(), config.commands.autopost.intervalChecker);
};

module.exports.help = {
  name: 'autopost',
};
