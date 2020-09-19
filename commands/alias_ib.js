module.exports.run = async (client, message, args, config, MessageEmbed, messageOwner) => {
  client.functions.get('inkbunny_core').run(client, message, args, config, MessageEmbed, messageOwner)
    .catch(console.log);
};

module.exports.help = {
  name: 'ib',
  usage: '(AMMOUNT) TAGS',
  title: 'InkBunny',
  desc: 'You can requwest up to 10 pictures at the twime. The ammount is alternatiwe and doewsn\'t need to be prowidewd.',
};
