const { Op } = require('sequelize');

const poolcache = require('../database/models/poolcache');

const errHander = (err) => { console.error('ERROR:', err); };

// async function pruneOldPoolData(config) {
//   // TODO: get ms bewteen now and creation time. if ms is larger then config.e621.poolHandler.maxCacheTime: get messageID and delete all
//   const found = await poolcache.findOne({ where: { createdAt } }).catch(errHander);
//   if (found) {
//     //
//     poolcache.destroy({ where: { messageID } }).catch(errHander);
//   }
// }

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

// adds all tags to embed
function addTags(post, poolData, embed) {
  const tags = post.tags;
  const artists = tags.artist.join(', ');
  let typeArtists = 'All artists';
  if (tags.artist.length === 1) typeArtists = 'Artist';
  embed.setAuthor(`${typeArtists}: ${artists}`);

  const extention = post.file.ext;
  if (extention === 'webm' || extention === 'swf') {
    embed.addField('Direct video link', post.file_url);
  }

  if (tags.character.length) embed.addField('Character tags', formatTags(tags.character), true);
  if (tags.species.length) embed.addField('Species tags', formatTags(tags.species), true);
  if (tags.copyright.length) embed.addField('Copyright tags', formatTags(tags.copyright), true);
  if (tags.meta.length) embed.addField('Meta tags', formatTags(tags.meta), true);
  if (tags.lore.length) embed.addField('Lore tags', formatTags(tags.lore), true);
  if (tags.invalid.length) embed.addField('Invalid tags', formatTags(tags.invalid), true);
  if (post.pools.length) {
    embed.addField('Pool', `https://e621.net/pools/${poolData.id}`, true);
    embed.addField('Pool Index', poolData.post_ids.indexOf(post.id), true);
  }
}

function postPicture(reaction, RichEmbed, previewMessage, config, post, poolData) {
  const embed = new RichEmbed();

  addTags(post, poolData, embed);

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
    .setDescription(`**General Tags:** \`\`\`${post.tags.general.join(', ')}\`\`\``)
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

async function postPoolReactions(reaction, pool, post) {
  if (post.id !== pool.post_ids.front) await reaction.message.react('◀️');
  // DEPRECATED: feature canceled because requieres more DB storage or API calls. Both are not ideal solutions
  // await reaction.message.react('🔢');
  if (post.id !== pool.post_ids.back) await reaction.message.react('▶️');
}

function storePool(pool, messageID) {
  pool.post_ids.forEach((postID, poolIndex) => {
    poolcache.create({ messageID, poolIndex, postID });
  });
}

module.exports.run = async (reaction, config, RichEmbed) => {
  const embed = reaction.message.embeds[0];
  // check if already showing details
  if (embed.title === 'E621 Link') return;
  const id = embed.url.replace('https://e621.net/posts/', '');
  const post = await requestPicture(id, config);
  const poolData = await requestPool(post.pools[0], config);
  postPicture(reaction, RichEmbed, embed, config, post, poolData);
  if (post.pools.length) {
    await storePool(poolData, reaction.message.id);
    postPoolReactions(reaction, poolData, post);
  }
};

module.exports.help = {
  name: 'FUNC_e621_detailed',
};
