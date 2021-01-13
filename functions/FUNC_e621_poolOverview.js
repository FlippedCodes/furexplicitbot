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

function getTags(post, embed) {
  const tags = post.tags;
  const artists = tags.artist.join(', ');
  let typeArtists = 'All artists';
  if (tags.artist.length === 1) typeArtists = 'Artist';
  embed.setAuthor(`${typeArtists}: ${artists}`);

  const extention = post.file.ext;
  if (extention === 'webm' || extention === 'swf') {
    embed.addField('Direct video link', post.file_url);
  }

  if (tags.character.length !== 0) embed.addField('Character tags', formatTags(tags.character), true);
  if (tags.species.length !== 0) embed.addField('Species tags', formatTags(tags.species), true);
  if (tags.copyright.length !== 0) embed.addField('Copyright tags', formatTags(tags.copyright), true);
  if (tags.meta.length !== 0) embed.addField('Meta tags', formatTags(tags.meta), true);
  if (tags.lore.length !== 0) embed.addField('Lore tags', formatTags(tags.lore), true);
  if (tags.invalid.length !== 0) embed.addField('Invalid tags', formatTags(tags.invalid), true);
}

function postPicture(reaction, RichEmbed, previewMessage, config, post) {
  const embed = new RichEmbed();

  getTags(post, embed);

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
  switch (reaction.emoji.identifier) {
    case allDetailtEmoji: {
      const embed = reaction.message.embeds[0];
      const id = embed.url.replace('https://e621.net/posts/', '');
      const post = await requestPicture(id, config);
      postPicture(reaction, RichEmbed, embed, config, post);
      if (post.pools.length) {
        postReactions(reaction, config, post);
      }
      return;
    }
    default: return;
  }
};

module.exports.help = {
  name: 'FUNC_e621_poolOverview',
};
