// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

function buildRequest(id, config, type) {
  const version = require('../package.json');
  return {
    method: 'GET',
    uri: `https://e621.net/${type}/${id}.json?login=${config.env.get('e621_login')}&api_key=${config.env.get('e621_api_key')}`,
    headers: {
      'User-Agent': `FurExplicitBot/${version.version} by Flipper on e621`,
    },
    json: true,
  };
}

async function getRequest(request) {
  const rp = require('request-promise');
  const result = await rp(request);
  return result;
}

async function requestPicture(id, config) {
  const post = await getRequest(buildRequest(id, config, 'posts'));
  return post.post;
}

async function requestPool(id, config) {
  const pool = await getRequest(buildRequest(id, config, 'pools'));
  return pool;
}

function formatTags(tags) {
  const joinedTags = tags.join(', ');
  return `\`${joinedTags}\``;
}

function postPicture(reaction, RichEmbed, previewMessage, config, post, poolData) {
  const embed = new RichEmbed();

  if (post.pools.length) {
    embed.addField('Pool', `https://e621.net/pools/${poolData.id}`, true);
    embed.addField('Pool Index', poolData.post_ids.indexOf(post.id), true);
  }
  const extention = post.file.ext;
  if (extention === 'webm' || extention === 'swf') {
    embed.addField('Direct video link', post.file_url);
  }

  let source = 'none';
  let typeSources = 'Sources';
  if (post.sources.length !== 0) {
    source = post.sources.join('\n');
    if (post.sources.length === 1) typeSources = 'Source';
  }

  embed
    .setColor(previewMessage.color)
    .setTitle('E621 Link')
    .setURL(`https://e621.net/posts/${post.id}`)
    .setDescription(`**Tags:** \`\`\`${post.tags.general.join(', ')}\`\`\``)
    .addField('Rating', post.rating, true)
    .addField('Score', post.score.total, true)
    .addField('ID', post.id, true)
    .addField('Resolution', `${post.file.width}x${post.file.height}`, true)
    .addField(typeSources, source)
    .addField('Full Picture link', post.file.url)
    .setImage(post.file.url)
    .setFooter(config.e621.label, config.e621.logo)
    .setTimestamp();
  reaction.message.edit({ embed });
}

async function postReactions(reaction, config, post) {
  const pool = await requestPool(post.pools[0], config);
  if (post.id !== pool.post_ids.front) await reaction.message.react('◀️');
  await reaction.message.react('🔢');
  if (post.id !== pool.post_ids.back) await reaction.message.react('▶️');
}

module.exports.run = async (reaction, config, RichEmbed) => {
  // check if message is in detailed mode
  // get pool link (for re-use)
  // get embed poolname (for re-use)
  // check DB for pool entry
};

module.exports.help = {
  name: 'FUNC_e621_poolBack',
};
