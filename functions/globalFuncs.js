const Uwuifier = require('uwuifier');

const uwuifier = new Uwuifier({
  spaces: {
    faces: 0.1,
    actions: 0,
    stutters: 0.3,
  },
  words: 0.6,
  exclamations: 0,
});

global.uwu = (text) => {
  const splitText = text.split(' ');
  const out = splitText.map((word) => {
    if (word.includes('ßß')) return word.replace('ßß', '');
    return uwuifier.uwuifySentence(word);
  });
  return out.join(' ');
};

global.messageFail = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 16449540, false, ephemeral || true);
  return sentMessage;
};

global.messageSuccess = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 4296754, false, ephemeral || false);
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
