const Uwuifier = require('uwuifier');

const uwuifier = new Uwuifier(config.functions.globalFuncs.uwuifier);

global.uwu = (text) => {
  // function leaves all words alone with a prefix of "ßß" That way markdown and links can be left untouched by the uwu
  const splitText = text.split(' ');
  const out = splitText.map((word) => {
    if (word.includes('ßß')) return word.replace('ßß', '');
    return uwuifier.uwuifySentence(word);
  });
  return out.join(' ');
};

global.messageFail = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 'RED', false, ephemeral || true);
  return sentMessage;
};

global.messageSuccess = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 'GREEN', false, ephemeral || false);
  return sentMessage;
};

// raw reply to commands
global.reply = (interaction, payload, followUp = false) => {
  if (followUp) return interaction.followUp(payload);
  // check if message needs to be edited or if its a first reply
  if (interaction.deferred || interaction.replied) return interaction.editReply(payload);
  return interaction.reply(payload);
};

global.prettyCheck = (question) => {
  if (question) return '✅';
  return '❌';
};

module.exports.data = {
  name: 'globalFunc',
};
