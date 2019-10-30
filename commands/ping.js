module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  message.channel.send('Pong...').then((msg) => {
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(msg.client.ping)}ms`);
    return;
  });
};

module.exports.help = {
  name: 'ping',
};
