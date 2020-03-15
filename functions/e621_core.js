const rp = require('request-promise');

const version = require('../package.json');

function Timeout(msg, userID, messageOwner, config) {
  messageOwner.set(msg.id, userID);
  setTimeout(() => {
    messageOwner.delete(msg.id);
    msg.clearReactions().catch();
  }, config.reactionsTimeout);
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  message.react(client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji)).then((reaction_loading) => {
    let [limit] = args;
    let tags = args.join(' ');
    tags = tagsReplace(tags, ', ', ' ');
    if (isNaN(limit) || limit === 0) limit = 1;
    else tags = tags.slice(limit.length + 1);

    let uri = 'https://e621.net/posts.json';
    if (message.channel.nsfw === false) uri = 'https://e926.net/posts.json';
    if (limit > 10 && message.author.id !== config.owner) {
      message.reply('you can only requwest a maximum of 10 images at the twime.')
        .then((msg) => msg.delete(10000));
      reaction_loading.remove(client.user);
      return;
    }
    if (limit > 3) {
      const embed = new RichEmbed().setDescription('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<');
      message.channel.send({ embed })
        .then((msg) => msg.delete(10000));
    }
    const request = {
      method: 'GET',
      uri,
      body: {
        limit: '300',
        tags,
      },
      headers: { 'User-Agent': `FurExplicitBot/${version.version} by Flipper on e621` },
      json: true,
    };
    rp(request)
      .then((pics) => {
        const pool = pics.posts;
        if (pool.length === 0) return message.channel.send('Sowwy, I found no pictures with your tags. uwu');
        for (let i = 0; i < limit; i++) {
          const randomChoice = Math.floor(Math.random() * pool.length);
          let typePic = 'Preview';
          let picURL = pool[randomChoice].sample.url;
          const extention = pool[randomChoice].file.ext;
          const embed = new RichEmbed();
          embed
            .setColor(config.color_e621)
            .setTitle(`Artist: ${pool[randomChoice].tags.artist[0]} [e621 link]`)
            .setURL(`https://e621.net/posts/${pool[randomChoice].id}`)
            .setImage(picURL)
            .setFooter('e621.net', config.logo_e621)
            .setTimestamp();
          if (extention === 'gif' || extention === 'webm' || extention === 'swf') {
            typePic = 'Direct video link';
            picURL = pool[randomChoice].file.url;
            if (extention === 'webm' || extention === 'swf') {
              embed.addField(typePic, pool[randomChoice].file.url);
            }
          }
          message.channel.send({ embed })
            .then((msg) => {
              // DISABLED: function for one post request missing/not found
              msg.react('❌');
              // msg.react('↗')
              //   .then(() => msg.react('❌'));
              Timeout(msg, message.author.id, messageOwner, config);
            });
        }
      })
      .then(() => {
        reaction_loading.remove(client.user);
      });
  })
    .catch((err) => {
      message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu')
        .then(() => message.react('❌'));
      console.error(err);
    });
};

module.exports.help = {
  name: 'e621_core',
};
