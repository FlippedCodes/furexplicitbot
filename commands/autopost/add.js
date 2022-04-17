/* eslint-disable no-bitwise */
const autopostchannel = require('../../database/models/autopostchannel');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function countChannels(serverID) {
  const result = await autopostchannel.findAndCountAll({ where: { serverID } }).catch(errHander);
  return result.count;
}

async function addAutopost(tags, interval, channelID, serverID, maxChannels) {
  const date = new Date();
  const nextEvent = date.getTime();
  if (await countChannels(serverID) > maxChannels) return 1;
  if (await autopostchannel.findOne({ where: { channelID } }).catch(errHander)) return 2;
  await autopostchannel.findOrCreate({
    where: { channelID },
    defaults: {
      tags, serverID, interval, nextEvent,
    },
  }).catch(errHander);
  return true;
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

async function parseTags(tags) {
  // tags = tagsReplace(tags, ', ', ' ');
  // const safeTags = await message.client.functions.get('FUNC_tagsCleanup').run(message, tags);
  // return safeTags;
  return tagsReplace(tags, ', ', ' ');
}

async function getAmmount(request) {
  const axios = require('axios');
  const pics = await axios(request);
  return pics.posts.length;
}

function getEndpoint(nsfw, config) {
  let uri = config.e621.endpoint.sfw;
  if (nsfw) uri = config.e621.endpoint.nsfw;
  return uri;
}

function buildRequest(url) {
  return {
    method: 'GET',
    uri: url,
    headers: { 'User-Agent': `FurExplicitBot/${config.package.version} by Flipper on e621` },
    json: true,
  };
}

async function checkAmmount(config, tags, nsfw) {
  const endpoint = getEndpoint(nsfw, config);
  const uri = `${endpoint}?tags=${tags} order:random&limit=${config.e621.autopost.maxCache}&login=${config.env.get('e621_login')}&api_key=${config.env.get('e621_api_key')}`;
  const ammount = await getAmmount(buildRequest(uri));
  const result = ammount < config.e621.autopost.minPics;
  return result;
}

module.exports.run = async (interaction, autopostchannel, servertagsblacklist) => {
  if (interval > config.e621.autopost.maxPostTime || interval < config.e621.autopost.minPostTime) {
    return messageFail(interaction, uwu(`Interval needs to be between ßß${config.command.autopost.minPostTime} and ßß${config.command.autopost.maxPostTime} milliseconds.`));
  }
  const tags = await parseTags(args.join(' ').slice(subcmd.length + 1 + interval.length + 1));
  if (tags.length > 255) {
    return messageFail(interaction, 'Your tawgs are too lowng. The maximum length is 255 characters.');
  }
  if (await checkAmmount(config, tags, interaction.channel.nsfw)) {
    return messageFail(interaction, `Your prowided tawgs don't return the minimum ammount of ${config.e621.autopost.maxCache} powsts.`);
  }
  const added = await addAutopost(tags, interval, interaction.channel.id, interaction.guild.id, config.e621.autopost.maxChannels);
  switch (added) {
    case true:
      const tagsDisplay = await interaction.client.functions.get('FUNC_tagsCleanup').run(interaction, tags);
      return messageSuccess(interaction, `Your autopowst with the tawgs \`${tagsDisplay}\` has been created. The first powst appear sowon.`);
    case 1: return messageFail(interaction, 'You alreawdy hawe 2 autopowst channels in this serwer!');
    case 2: return messageFail(interaction, 'You are alreawdy uwsing this channel as an autopowst channel!');
    default: return messageFail(interaction, 'Woops, seems like the wizard behind the curtain has tripped! Try again later. uwu');
  }
};

module.exports.data = { subcommand: true };
