module.exports.run = async (client, message, args, config, MessageEmbed, messageOwner) => {
  client.functions.get('inkbunny_core').run(client, message, args, config, MessageEmbed, messageOwner)
    .catch(console.log);
};

module.exports.help = {
  name: 'ibunny',
};
