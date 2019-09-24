const rp = require('request-promise');
// TODO: get pool and child posts
// TODO: Remove reactions after some time
// TODO: changable prefix and saved to DB
// TODO: add pic resolution
// TODO: remove triggered recations. like expantion (needs permission checking before removal)

function missingPermissions(message) {
  message.channel.send('You are nowt allowoed to delewt this message <.<')
    .then(msg => msg.delete(10000));
  // FIXME: Delete reaction by user
  // TODO: make rich embed
}

function messageDelete(message, messageOwner) {
  if (messageOwner.has(message.id)) messageOwner.delete(message.id);
  message.delete();
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

module.exports.run = async (client, reaction, user, config, RichEmbed, fs, messageOwner) => {
  switch (reaction.emoji.name) {
    case '↗':
      const id = reaction.message.embeds[0].url.replace('https://e621.net/post/show/', '');
      const color = reaction.message.embeds[0].color;
      let e621_id = {
        method: 'POST',
        uri: 'https://e621.net/post/show.json',
        body: {
          id,
        },
        headers: {
          'User-Agent': 'DiscordBot - FurExplicitBot',
        },
        json: true,
      };
      rp(e621_id)
        .then((post) => {
          let source = 'none';
          let typeSources = 'Sources';
          if (post.sources) {
            source = post.sources.join('\n');
            if (post.sources.length === 1) typeSources = 'Source';
          }
          let artists = post.artist.join(', ');
          let typeArtists = 'All artists';
          if (post.artist.length === 1) typeArtists = 'Artist';
          let arrow = '🔽';
          const extantion = post.file_ext;
          if (extantion === 'webm' || extantion === 'swf') arrow = post.file_url;
          let embed = new RichEmbed()
            .setAuthor(`${typeArtists}: ${post.artist[0]}`)
            .setColor(color)
            .setTitle('E621 Link')
            .setURL(`https://e621.net/post/show/${post.id}`)
            .setDescription(`**Tags:** \`\`\`${tagsReplace(post.tags, ' ', ', ')}\`\`\``)
            .addField('Rating', post.rating, true)
            .addField('Score', post.score, true)
            .addField('ID', post.id, true)
            .addField('Resolution', `${post.width}x${post.height}`, true)
            .addField(typeSources, source)
            .addField('Full Picture link', post.file_url)
            .addField('Full Picture', arrow)
            .setImage(post.file_url)
            .setFooter('e621.net', config.logo_e621)
            .setTimestamp();
          reaction.message.edit({ embed });
        });
      return;
    case '❌':
      // FIXME: removal of reaction (refferes to missingPermissions function)
      if (reaction.message.guild.member(user).hasPermission('MANAGE_MESSAGES')) {
        messageDelete(reaction.message, messageOwner);
      } else if (messageOwner.has(reaction.message.id)) {
        if (messageOwner.get(reaction.message.id) === user.id) {
          messageDelete(reaction.message, messageOwner);
        } else missingPermissions(reaction.message);
      } else missingPermissions(reaction.message);
      return;
    default:
      return;
  }
};

module.exports.help = {
  name: 'e621_detailed',
};
