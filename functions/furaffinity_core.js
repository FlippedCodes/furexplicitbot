const {
  Recent,
  Type,
  Login,
  Submission,
  Search,
} = require('furaffinity');

function Timeout(msg, userID, messageOwner, config) {
  messageOwner.set(msg.id, userID);
  setTimeout(() => {
    messageOwner.delete(msg.id);
    msg.clearReactions();
  }, config.reactionsTimeout);
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

function previewMessage(submission, RichEmbed, config, message, messageOwner, reaction_loading, client) {
  let embed = new RichEmbed()
    .setAuthor(`Artist: ${submission.author.name}`)
    .setColor(config.color_fa)
    .setTitle('Furaffinity Link')
    .setURL(submission.url)
    .addField('Preview', '🔽')
    .setImage(submission.thumb.large)
    .setFooter('Furaffinity', config.logo_fa)
    .setTimestamp();
  message.channel.send({ embed })
    .then((msg) => {
      msg.react('❌');
      Timeout(msg, message.author.id, messageOwner, config);
      reaction_loading.remove(client.user);
    });
}

module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  message.react(client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji)).then((reaction_loading) => {
    let [subcmd, limit] = args;
    let searchwords = args.join(' ');
    // tags = tagsReplace(tags, ', ', ' ');
    searchwords = searchwords.slice(subcmd.length + 1);
    if (isNaN(limit) || limit === 0) limit = 1;
    else searchwords = searchwords.slice(limit.length + 1);

    // FIXME: NSFW content is shown in sfw rooms, currently disabled in said rooms
    if (message.channel.nsfw === false) {
      message.reply('EDITOR NOTE: Hey there, I\'m sorry but this feature was taken out in SFW rooms for the time being. I made a mistake with NSFW content being shown in there and haven\'t found time yet to fix it. I hope you understand and sorry for the inconvenience. You can use this command without problems in a NSFW marked room.')
        .then((msg) => msg.delete(30000));
      reaction_loading.remove(client.user);
      return;
    }

    Login(fa_token_A, fa_token_B);

    switch (subcmd) {
      case 'recent':
        if (searchwords) {
          message.reply('there awre nwo tags needewd in recent.')
            .then((msg) => msg.delete(10000));
        }
        if (limit > 10 && message.author.id !== config.owner) {
          message.reply('you can only requwest a maximum of 10 images at the twime.')
            .then((msg) => msg.delete(10000));
          reaction_loading.remove(client.user);
          return;
        }
        if (limit > 3) {
          let embed = new RichEmbed().setDescription('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<');
          message.channel.send({ embed })
            .then((msg) => msg.delete(10000));
        }
        Recent(Type.Artwork).then((pool) => {
          for (let i = 0; i < limit; i++) {
            previewMessage(pool[i], RichEmbed, config, message, messageOwner, reaction_loading, client);
          }
        });
        return;
      // disabled due to issues in fa-node
      // case 'submission':
      //   // TODO: NSFW forbidden!
      //   let post = limit;
      //   if (!post) {
      //     message.reply('plewse prwide an id for me to fiwnd.')
      //       .then((msg) => msg.delete(10000));
      //     reaction_loading.remove(client.user);
      //     return;
      //   }
      //   if (searchwords) {
      //     message.reply('there awre nwo tags needewd to get a submission.')
      //       .then((msg) => msg.delete(10000));
      //   }
      //   Submission(post).then((submission) => {
      //     let embed = new RichEmbed()
      //       .setAuthor(`Artist: ${submission.author.name}`)
      //       .setColor(config.color_fa)
      //       .setTitle('Furaffinity Link')
      //       .setURL(submission.url)
      //       .setDescription(`**Tags:** \`\`\`${submission.keywords.join(', ')}\`\`\``)
      //       // .addField('Title', submission.title, true)
      //       // FIXME: Title broken in fa-node
      //       // .addField('Rating', post.rating, true)
      //       // TODO: Find out different rating lvls
      //       .addField('ID', submission.id, true)
      //       .addField('Resolution', `${submission.image.width}x${submission.image.height}`, true)
      //       .addField('Comments', submission.stats.comments, true)
      //       .addField('Favorites', submission.stats.favorites, true)
      //       .addField('Views', submission.stats.views, true)
      //       .addField('Full Picture link', submission.image.url)
      //       .addField('Full Picture', '🔽')
      //       .setImage(submission.image.url)
      //       .setFooter('Furaffinity', config.logo_fa)
      //       .setTimestamp();
      //     message.channel.send({ embed })
      //       .then(((msg)) => {
      //         msg.react('❌');
      //         Timeout((msg), message.author.id, messageOwner, config);
      //         reaction_loading.remove(client.user);
      //       });
      //   });
      //   return;
      case 'search':
        if (!searchwords) {
          message.reply('plewse prowide me something I should search.')
            .then((msg) => msg.delete(10000));
          reaction_loading.remove(client.user);
          return;
        }
        if (limit > 10 && message.author.id !== config.owner) {
          message.reply('you can only requwest a maximum of 10 images at the twime.')
            .then((msg) => msg.delete(10000));
          reaction_loading.remove(client.user);
          return;
        }
        if (limit > 3) {
          let embed = new RichEmbed().setDescription('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<');
          message.channel.send({ embed })
            .then((msg) => msg.delete(10000));
        }
        Search(searchwords).then((pool) => {
          for (let i = 0; i < limit; i++) {
            const randomChoice = Math.floor(Math.random() * pool.length);
            previewMessage(pool[randomChoice], RichEmbed, config, message, messageOwner, reaction_loading, client);
          }
        });
        return;
      case 'help':
        let embed = new RichEmbed()
          .setAuthor('USAGE: Furaffinity')
          .setColor(message.member.displayColor)
          .addField('Search', `
            ${config.prefix}fa search (AMMOUNT) SEARCH
            Search for pictuwres on fa.
            `)
          .addField('Recent', `
            ${config.prefix}fa recent (AMMOUNT)
            You can requwest up to 10 pictures at the twime.
            The ammount is alternatiwe and doewsn't need to be prowidewd.
            `)
          .addField('Help', `
            ${config.prefix}fa
            Get thwis hewlp.
            `)
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        message.channel.send({ embed });
        return;
      default:
        client.functions.get('invalid_cmd').run(message, subcmd)
          .catch(console.log);
        reaction_loading.remove(client.user);
        return;
    }
  })
    .catch((err) => {
      message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu')
        .then(() => message.react('❌'));
      console.error(err);
    });
};

module.exports.help = {
  name: 'furaffinity_core',
};
