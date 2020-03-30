module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  client.functions.get('rule34_core').run(client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B)
    .catch(console.log);
};

module.exports.help = {
  name: 'r34',
  usage: '(AMMOUNT) TAGS',
  title: 'Rule34',
  desc: 'You can requwest up to 10 pictures at the twime. The ammount is alternatiwe and doewsn\'t need to be prowidewd',
};
