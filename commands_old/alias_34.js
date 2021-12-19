module.exports.run = async (client, message, args, config, MessageEmbed, messageOwner, fa_token_A, fa_token_B) => {
  client.functions.get('FUNC_rule34_core').run(client, message, args, config, MessageEmbed, messageOwner, fa_token_A, fa_token_B)
    .catch(console.log);
};

module.exports.help = {
  name: '34',
};
