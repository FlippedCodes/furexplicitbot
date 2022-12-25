const { EmbedBuilder, PermissionsBitField } = require('discord.js');

const { Login, Submission } = require('furaffinity-api');

const postfacache = require('../../database/models/postfacache');

Login(process.env.login_fa_cookie_a, process.env.login_fa_cookie_b);

// create new jobs from submission list
// if no channel with artist can be assosiated: unfollow artist
function getNewPosts() {

}

// delete stuck jobs, that dont belong to any shard
function houseKeeping() {

}

function postMessage(post, channel) {
  const embed = new EmbedBuilder();
  embed
    .setColor(config.engine.furaffinity.color)
    .setAuthor({ name: post.author.name, iconURL: post.author.avatar, url: post.author.url })
    .setTitle(post.title)
    .setURL(post.url)
    // maybe switch to "post.downloadUrl"
    .setImage(post.previewUrl)
    .setFooter({ text: 'Picture from FurAffinity', iconURL: config.engine.furaffinity.logo })
    .setTimestamp();
  channel.send({ embeds: [embed] });
}

// abort postingas channel is sfw
function abortMessage(channel) {
  const embed = new EmbedBuilder();
  const title = 'Hello! Your channel not marked as ßßage-restricted ßß(NSFW).';
  const body = 'As per the newest bot update and to further comply with discords guidelines, the bot will no longer post any art in any unmarked channel. \nMake sure to adjust the channel settings.';
  embed
    .setColor('Red')
    .setDescription(body)
    .setTitle(title);
  channel.send({ embeds: [embed] });
}

async function main() {
  // await getNewPosts();
  // await houseKeeping();

  // get all jobs
  const posts = await postfacache.findAll().catch(ERR);
  posts.forEach(async (post) => {
    const channelID = post.channelID;
    const channel = client.channels.cache.find((channel) => channel.id === channelID);
    // if channel doesnt exist, disregard job
    if (!channel) return;
    // check, if bot has permission to send messages
    if (!channel.guild.members.me.permissionsIn(channel).has(new PermissionsBitField(['SendMessages', 'ViewChannel']))) {
      return;
    }

    // return abort message if channel is sfw
    if (!channel.nsfw && !config.functions.allowSFWChannels) return abortMessage(channel, channelID, currentTimestamp, autoPost.interval);

    // get post details and send in channel
    const submission = await Submission(post.submissionID);
    // tags, channelID, nsfw
    await postMessage(submission, channel);
    await postfacache.destroy({ where: { channelID: post.channelID, submissionID: post.submissionID } }).catch(ERR);
  });
}

module.exports.run = () => {
  if (DEBUG) main();
  setInterval(() => main(), config.commands.faAutopost.intervalChecker);
};

module.exports.help = {
  name: 'faAutopost',
};
