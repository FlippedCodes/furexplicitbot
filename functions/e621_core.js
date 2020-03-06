const rp = require('request-promise');

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

module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  message.channel.send('Sowwy, but e621 has updawted theiw website and I can\'t get any more picturews >.< My creator is gowing to fix me as soown as powssible! uwu')
    .then(() => message.react('❌'));
};

module.exports.help = {
  name: 'e621_core',
};
