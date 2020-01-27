module.exports.run = async (client, message, args, config, RichEmbed, messageOwner) => {
  client.functions.get('inkbunny_core').run(client, message, args, config, RichEmbed, messageOwner)
    .catch(console.log);
};

module.exports.help = {
  name: 'inkb',
};
