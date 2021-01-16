function timeout(id, usedRecently, time) {
  usedRecently.add(id);
  setTimeout(() => usedRecently.delete(id), time);
}

function messageDelete(message, messageOwner) {
  if (messageOwner.has(message.id)) messageOwner.delete(message.id);
  message.delete();
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

function checkPermissions(reaction, user, messageOwner) {
  let permissions = false;
  if (reaction.message.guild.member(user).hasPermission('MANAGE_MESSAGES')) permissions = true;
  if (messageOwner.has(reaction.message.id)) if (messageOwner.get(reaction.message.id) === user.id) permissions = true;
  return permissions;
}

module.exports.run = async (client, reaction, user, config, MessageEmbed, messageOwner, usedRecently) => {
  if (user.bot) return;
  // check if reaction is by own bot
  if (!reaction.me) return;

  if (reaction.emoji.name === '❌') {
    if (!checkPermissions(reaction, user, messageOwner)) return messageFail(reaction.message, 'You are nowt allowoed to delewt this message <.<\'');
    messageDelete(reaction.message, messageOwner);
    return;
  }

  // check if message was sent by bot
  if (!config.env.get('inDev')) { if (reaction.message.author.id !== config.clientID) return; }

  const botPerms = await client.functions.get('FUNC_checkBotPermissions').run(reaction.message, 'MANAGE_MESSAGES');
  if (botPerms) reaction.users.remove(user);

  // check if user hit ratelimit
  if (usedRecently.has(user.id)) {
    messageFail(reaction.message, 'sowwy, but you can\'t boop me that owten. Plewse wait 4 seconds between boops.');
    return;
  }
  // add user to ratelimit
  timeout(user.id, usedRecently, 2000);
  timeout(user.id, usedRecently, 4000);
  // selects what picture service was used
  switch (reaction.message.embeds[0].footer.text) {
    case config.e621.label: {
      // reaction selector for e621
      switch (reaction.emoji.name) {
        case 'all_details': return client.functions.get('FUNC_e621_detailed').run(reaction, config, MessageEmbed);
        case '◀️': return client.functions.get('FUNC_e621_poolBack').run(reaction, config, MessageEmbed);
        // case '🔢': return client.functions.get('FUNC_e621_poolOverview').run(reaction, config, MessageEmbed);
        case '▶️': return client.functions.get('FUNC_e621_poolFore').run(reaction, config, MessageEmbed);
        default: return;
      }
    }
    default: return;
  }
};

module.exports.help = {
  name: 'EVENT_messageReactionAdd',
};
