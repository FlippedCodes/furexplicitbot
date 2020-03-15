// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete(10000));
}

// assignes requested posts to user for reactions
function Timeout(msg, userID, messageOwner, config) {
  messageOwner.set(msg.id, userID);
  setTimeout(() => {
    messageOwner.delete(msg.id);
    msg.clearReactions().catch();
  }, config.reactionsTimeout);
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

function getTags(args) {
  let [limit] = args;
  let tags = args.join(' ');
  tags = tagsReplace(tags, ', ', ' ');
  if (isNaN(limit) || limit === 0) limit = 1;
  else tags = tags.slice(limit.length + 1);
  return [tags, limit];
}

function checkRequestedLimit(message, limit) {
  let decision = true;
  if (limit > 10) {
    // if (limit > 10 && message.author.id !== config.owner) {
    messageFail(message, 'You can only requwest a maximum of 10 images at the twime.');
    decision = false;
  }
  return decision;
}

// switched as the e926 api is broken
// function getEndpoint(message, config) {
//   let uri = config.e621.endpoint.sfw;
//   if (message.channel.nsfw) uri = config.e621.endpoint.nsfw;
//   return uri;
// }
function getEndpoint(message, config) {
  let uri = config.e621.endpoint.nsfw;
  let safe = ' rating=s';
  if (message.channel.nsfw) {
    uri = config.e621.endpoint.nsfw;
    safe = '';
  }
  return [uri, safe];
}

function buildRequest(uri) {
  const version = require('../package.json');
  return {
    method: 'GET',
    uri,
    headers: { 'User-Agent': `FurExplicitBot/${version.version} by Flipper on e621` },
    json: true,
  };
}

async function getRequest(request) {
  const rp = require('request-promise');
  const pics = await rp(request);
  return pics.posts;
}

async function requestPictures(message, config, tags, limit) {
  const [endpoint, rating] = getEndpoint(message, config);
  const uri = `${endpoint}?tags=${tags} order:random${rating}&limit=${limit}`;
  const posts = await getRequest(buildRequest(uri));
  return posts;
}

function postPictures(RichEmbed, message, config, limit, messageOwner, pool) {
  if (pool.length === 0) return messageFail(message, 'Sowwy, I found no pictures with your tags. uwu');
  if (pool.length !== limit) {
    if (pool.length !== 10 && limit !== 10) messageFail(message, `Thewe arwe ownly ${pool.length + 1} post(s) with your tawgs.`);
  }
  const embed = new RichEmbed();
  pool.forEach(async (post) => {
    const extention = post.file.ext;
    let picURL = post.sample.url;
    if (extention === 'gif') picURL = post.file.url;
    if (extention === 'webm' || extention === 'swf') embed.addField('Direct video link', post.file.url);
    embed
      .setColor(config.e621.color)
      .setTitle(`Artist: ${post.tags.artist.join(', ')} [e621 link]`)
      .setURL(`https://e621.net/posts/${post.id}`)
      .setImage(picURL)
      .setFooter('e621.net', config.e621.logo)
      .setTimestamp();
    const msg = await message.channel.send({ embed });
    await msg.react('❌');
    await msg.react('↗');
    Timeout(msg, message.author.id, messageOwner, config);
  });
}

module.exports.run = async (client, message, args, config, RichEmbed, messageOwner) => {
  const reaction_loading = await message.react(client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji));
  const editedTags = getTags(args);
  const tags = editedTags[0];
  let limit = editedTags[1];
  if (!await checkRequestedLimit(message, limit, reaction_loading)) limit = 10;
  await postPictures(RichEmbed, message, config, limit, messageOwner, await requestPictures(message, config, tags, limit));

  await reaction_loading.remove(client.user);
};

module.exports.help = {
  name: 'e621_core_rewrite',
};
