function messageDelete(message, messageOwner) {
  if (messageOwner.has(message.id)) messageOwner.delete(message.id);
  message.delete();
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete(10000));
}

function checkPermissions(reaction, user, messageOwner) {
  let permissions = false;
  if (reaction.message.guild.member(user).hasPermission('MANAGE_MESSAGES')) permissions = true;
  if (messageOwner.has(reaction.message.id)) if (messageOwner.get(reaction.message.id) === user.id) permissions = true;
  return permissions;
}

module.exports.run = async (client, reaction, user, config, MessageEmbed, messageOwner) => {
  if (user.bot) return;
  if (!reaction.me) return;

  if (reaction.emoji.name === '❌') {
    if (!checkPermissions(reaction, user, messageOwner)) return messageFail(reaction.message, 'You are nowt allowoed to delewt this message <.<\'');
    messageDelete(reaction.message, messageOwner);
    return;
  }

  switch (reaction.message.embeds[0].footer.text) {
    case config.e621.label: {
      client.functions.get('e621_detailed').run(reaction, config, MessageEmbed);
      return;
    }
    default:
      return;
  }
};

module.exports.help = {
  name: 'EVENT_messageReactionAdd',
};
