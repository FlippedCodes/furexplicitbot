const { EmbedBuilder, PermissionsBitField, Colors } = require('discord.js');

const { Login, Submission } = require('furaffinity-api');

const postfacache = require('../../database/models/postfacache');

Login(process.env.login_fa_cookie_a, process.env.login_fa_cookie_b);

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

// abort posting as channel is sfw
function abortMessage(channel) {
  const embed = new EmbedBuilder();
  const title = 'Hello! Your channel not marked as ßßage-restricted ßß(NSFW).';
  const body = 'As per the newest bot update and to further comply with discords guidelines, the bot will no longer post any art in any unmarked channel. \nMake sure to adjust the channel settings.';
  embed
    .setColor(Colors.Red)
    .setDescription(body)
    .setTitle(title);
  channel.send({ embeds: [embed] });
}

async function main() {
  // get all jobs
  const channels = client.channels.cache.map((channel) => channel.id);
  // TODO: sort after job id
  const posts = await postfacache.findAll({
    attributes: ['ID', 'channelID', 'submissionID'],
    where: { channelID: channels },
    order: [['ID', 'ASC']],
  }).catch(ERR);
  // calculate interval between jobs to destribute messages evenly
  const calcInterval = DEBUG ? 0 : config.commands.faAutopost.intervalChecker / posts.length;
  posts.forEach(async (post) => {
    setTimeout(async () => {
      const channelID = post.channelID;
      const channel = client.channels.cache.find((channel) => channel.id === channelID);
      // check, if bot has permission to send messages
      if (!channel.guild.members.me.permissionsIn(channel).has(new PermissionsBitField(['SendMessages', 'ViewChannel']))) {
        return;
      }
      // return abort message if channel is sfw
      if (!channel.nsfw && !config.functions.allowSFWChannels) return abortMessage(channel, channelID, currentTimestamp, autoPost.interval);

      // get post details and send in channel
      const submissionID = post.submissionID;
      const submission = await Submission(submissionID);
      // tags, channelID, nsfw
      await postMessage(submission, channel);
    }, calcInterval);
    // Needs to be cleared outside of the timeout, so it doesnt get picked up in the next interval
    post.destroy().catch(ERR);
  });
}

module.exports.run = () => {
  if (DEBUG) main();
  setInterval(() => main(), config.commands.faAutopost.intervalChecker);
};

module.exports.help = {
  name: 'faAutopost',
};
