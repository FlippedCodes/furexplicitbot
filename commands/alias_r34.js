module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  client.functions.get('rule34_core').run(client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B)
    .catch(console.log);
};

module.exports.help = {
  name: 'r34',
};
