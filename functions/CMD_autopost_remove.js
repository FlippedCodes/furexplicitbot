const autopostchannel = require('../database/models/autopostchannel');

const postcache = require('../database/models/postcache');

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

async function removeAutopost(channelID) {
  if (!await autopostchannel.findOne({ where: { channelID } }).catch(errHander)) return false;
  await postcache.destroy({ where: { channelID } }).catch(errHander);
  await autopostchannel.destroy({ where: { channelID } }).catch(errHander);
  return true;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {
  // check if user can manage servers
  if (!message.member.hasPermission('MANAGE_GUILD')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  const added = await removeAutopost(message.channel.id);
  if (added) {
    messageSuccess(message, 'This channel dowes now no longer autopowst.');
  } else {
    messageFail(message, 'This channel doewsn\'t have an autopowst configured!');
  }
};

module.exports.help = {
  name: 'CMD_autopost_remove',
  parent: 'autopost',
};
