module.exports.run = async (client, message, args, config, MessageEmbed, messageOwner, fa_token_A, fa_token_B) => {
  client.functions.get('e621_core').run(client, message, args, config, MessageEmbed, messageOwner, fa_token_A, fa_token_B)
    .catch(console.log);
};

module.exports.help = {
  name: 'e6',
  usage: '(AMMOUNT) TAGS',
  title: 'e621',
  desc: 'You can requwest up to 10 pictures at the twime. The ammount is alternatiwe and doewsn\'t need to be prowidewd.',
};
