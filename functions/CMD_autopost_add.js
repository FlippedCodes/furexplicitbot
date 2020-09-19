/* eslint-disable no-bitwise */
const autopostchannel = require('../database/models/autopostchannel');

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
    .then((msg) => msg.delete(10000));
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

async function getTags(message, tags) {
  tags = tagsReplace(tags, ', ', ' ');
  const safeTags = await message.client.functions.get('FUNC_tagsCleanup').run(message, tags);
  return safeTags;
}

async function getAmmount(request) {
  const rp = require('request-promise');
  const pics = await rp(request);
  return pics.posts.length;
}

function getEndpoint(nsfw, config) {
  let uri = config.e621.endpoint.sfw;
  if (nsfw) uri = config.e621.endpoint.nsfw;
  return uri;
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

async function checkAmmount(config, tags, nsfw) {
  const endpoint = getEndpoint(nsfw, config);
  const uri = `${endpoint}?tags=${tags} order:random&limit=${config.e621.autopost.maxCache}&login=${config.env.get('e621_login')}&api_key=${config.env.get('e621_api_key')}`;
  const ammount = await getAmmount(buildRequest(uri));
  const result = ammount < config.e621.autopost.minPics;
  return result;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // check if user can manage servers
  if (!message.member.hasPermission('MANAGE_GUILD')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  const [subcmd, interval, tagCheck] = args;
  if (!interval) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} INTERVALINMILLISECONDS TAGS\`\`\``);
  }
  if (isNaN(interval)) {
    return messageFail(message,
      `Interval needs to be a number.
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} INTERVALINMILLISECONDS TAGNAME\`\`\``);
  }
  if (interval > config.e621.autopost.maxPostTime || interval < config.e621.autopost.minPostTime) {
    return messageFail(message,
      `Interval neewds to bwe between ${config.e621.autopost.minPostTime} and ${config.e621.autopost.maxPostTime} milliseconds.
      Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} INTERVALINMILLISECONDS TAGNAME\`\`\``);
  }
  if (!tagCheck) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} ${interval} TAGS\`\`\``);
  }
  const tags = await getTags(message, args.join(' ').slice(subcmd.length + 1 + interval.length + 1));
  if (tags.length > 255) {
    return messageFail(message, 'Your tawgs are too lowng. The maximum length is 255 characters, minus the blackliwsted tawgs in this serwer.');
  }
  if (await checkAmmount(config, tags, message.channel.nsfw)) {
    return messageFail(message, `Your prowided tawgs don't return the minimum ammount of ${config.e621.autopost.maxCache} powsts.`);
  }
  const added = await addAutopost(tags, interval, message.channel.id, message.guild.id, config.e621.autopost.maxChannels);
  switch (added) {
    case true:
      messageSuccess(message, `Your autopowst with the tawgs \`${tags}\` has been created. The first powst appear sowon.`);
      return;
    case 1:
      messageFail(message, 'You alreawdy hawe 2 autopowst channels in this serwer!');
      return;
    case 2:
      messageFail(message, 'You are alreawdy uwsing this channel as an autopowst channel!');
      return;
    default:
      messageFail(message, 'Woops, seems like the wizard behind the curtain has tripped! Try again later. uwu');
      return;
  }
};

module.exports.help = {
  name: 'CMD_autopost_add',
  parent: 'autopost',
};
