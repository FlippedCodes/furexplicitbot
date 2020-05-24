// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete(10000));
}

function buildRequest(id, config) {
  const version = require('../package.json');
  return {
    method: 'GET',
    uri: `https://e621.net/posts/${id}.json?login=${config.env.get('e621_login')}&api_key=${config.env.get('e621_api_key')}`,
    headers: {
      'User-Agent': `FurExplicitBot/${version.version} by Flipper on e621`,
    },
    json: true,
  };
}

async function getRequest(request) {
  const rp = require('request-promise');
  const pics = await rp(request);
  return pics.post;
}

async function requestPicture(id, config) {
  const post = await getRequest(buildRequest(id, config));
  return post;
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

module.exports.run = async (reaction, config, RichEmbed) => {
  switch (reaction.emoji.identifier) {
    case await reaction.message.client.guilds.get(config.emoji.serverID).emojis.get(config.emoji.details).identifier: {
      const embed = reaction.message.embeds[0];
      const id = embed.url.replace('https://e621.net/posts/', '');
      postPicture(reaction, RichEmbed, embed, config, await requestPicture(id, config));
      return;
    }
    default: return;
  }
};

module.exports.help = {
  name: 'e621_detailed',
};
