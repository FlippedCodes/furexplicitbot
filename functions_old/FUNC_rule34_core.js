const rp = require('request-promise');

function Timeout(msg, userID, messageOwner, config) {
  messageOwner.set(msg.id, userID);
  setTimeout(() => {
    messageOwner.delete(msg.id);
    msg.reactions.removeAll().catch();
  }, config.reactionsTimeout);
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

module.exports.run = async (client, message, args, config, MessageEmbed, messageOwner, fa_token_A, fa_token_B) => {
  // const embed = new MessageEmbed().setDescription('**Developer note:** Sorry to inform you, but this command is currently broken. :(');
  // return message.channel.send({ embed });
  // eslint-disable-next-line no-unreachable
  message.react(client.guilds.cache.get(config.emoji.serverID).emojis.cache.get(config.emoji.loading)).then(async (reaction_loading) => {
    let [limit] = args;
    let tags = args.join(' ');
    tags = tagsReplace(tags, ', ', '+');
    tags = tagsReplace(tags, ' ', '+');
    if (isNaN(limit) || limit === 0) limit = 1;
    else tags = tags.slice(limit.length + 1);
    tags = await message.client.functions.get('FUNC_tagsCleanup').run(message, tags);

    if (message.channel.nsfw === false) {
      message.reply('sowwy, but rule34 is a complete nsfw siwte. So there are almowst no sfw post on there. >.<')
        .then((msg) => msg.delete(30000));
      reaction_loading.users.remove(client.user);
      return;
    }
    if (limit > 10 && message.author.id !== config.owner) {
      message.reply('you can only requwest a maximum of 10 images at the twime.')
        .then((msg) => msg.delete({ timeout: 10000 }));
      reaction_loading.users.remove(client.user);
      return;
    }
    if (limit > 3) {
      const embed = new MessageEmbed().setDescription('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<');
      message.channel.send({ embed })
        .then((msg) => msg.delete({ timeout: 10000 }));
    }
    const request = {
      method: 'GET',
      uri: `https://r34-json-api.herokuapp.com/posts?limit=300&tags=${tags}`,
      json: true,
    };
    rp(request)
      .then((json) => {
        if (json.length === 0) return message.channel.send('Sowwy, I found no pictures with your tags. uwu');
        for (let i = 0; i < limit; i++) {
          const randomChoice = Math.floor(Math.random() * json.length);
          let typePic = 'Preview';
          let picURL = json[randomChoice].sample_url;
          let arrow = '🔽';
          const extention = json[randomChoice].file_url.substr(json[randomChoice].file_url.length - 3);
          if (extention === 'gif' || extention === 'webm' || extention === 'swf') {
            typePic = 'Full Picture';
            picURL = json[randomChoice].file_url;
            if (extention === 'webm' || extention === 'swf') arrow = json[randomChoice].file_url;
          }
          const embed = new MessageEmbed()
            .setColor(config.color_r34)
            .setTitle('Rule34 Link')
            .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${json[randomChoice].id}`)
            .addField(typePic, arrow)
            .setImage(picURL)
            // FIXME: Find a nice rule34 logo
            .setFooter('Rule34')
            .setTimestamp();
          message.channel.send({ embed })
            .then((msg) => {
              msg.react('❌');
              Timeout(msg, message.author.id, messageOwner, config);
            });
        }
      })
      .then(() => {
        reaction_loading.users.remove(client.user);
      });
  })
    .catch((err) => {
      message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu')
        .then(() => message.react('❌'));
      console.error(err);
    });
};

module.exports.help = {
  name: 'FUNC_rule34_core',
};
