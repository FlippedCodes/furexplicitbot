const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const buttons = new MessageActionRow()
  .addComponents([
    new MessageButton()
      .setCustomId('delete')
      .setEmoji('✖️')
      .setLabel('Delete')
      .setStyle('DANGER'),
  ]);

async function requestPool(poolID, nsfw) {
  const e6Config = config.engine.e621;
  const url = nsfw ? e6Config.endpoint.nsfw : e6Config.endpoint.sfw;
  const posts = await axios({
    method: 'GET',
    url,
    headers: { 'User-Agent': `${config.package.name}/${config.package.version} by Flipper on e621` },
    params: {
      tags: `${tags} order:random`,
      limit,
      login: process.env.login_e621_user,
      api_key: process.env.token_e621,
    },
  });
  return posts.data.posts;
}

function formatTags(tags) {
  const joinedTags = tags.join(', ');
  const cutTags = joinedTags.length > 1010 ? `${joinedTags.slice(0, 1010)}...` : joinedTags;
  return `\`${cutTags}\``;
}

// adds all tags to embed
function addTags(submission, poolData, embed) {
  const tags = submission.tags;
  const artists = tags.artist.join(', ');
  const typeArtists = tags.artist.length === 1 ? 'Artist' : 'All artists';
  embed.setAuthor({ name: `${typeArtists}: ${artists}`, url: `https://e621.net/posts?tags=${tags.artist[0]}` });

  if (tags.character.length) embed.addField('Character tags', formatTags(tags.character), true);
  if (tags.species.length) embed.addField('Species tags', formatTags(tags.species), true);
  if (tags.copyright.length) embed.addField('Copyright tags', formatTags(tags.copyright), true);
  if (tags.meta.length) embed.addField('Meta tags', formatTags(tags.meta), true);
  if (tags.lore.length) embed.addField('Lore tags', formatTags(tags.lore), true);
  if (tags.invalid.length) embed.addField('Invalid tags', formatTags(tags.invalid), true);
  // TODO: need to check if poolData is null or other statement is required
  if (poolData) {
    embed.addField('Pool', `https://e621.net/pools/${poolData.id}`, true);
    embed.addField('Pool Name', poolData.name, true);
    embed.addField('Pool Page', poolData.post_ids.indexOf(submission.id) + 1, true);
    embed.addField('Pool last page', `${poolData.post_count}`, true);
  }
}

function prepareMessage(submission, orgMessage, poolData) {
  const embed = new MessageEmbed();

  addTags(submission, poolData, embed);

  let source = 'none';
  let typeSources = 'Sources';
  if (submission.sources.length !== 0) {
    source = submission.sources.join('\n');
    if (submission.sources.length === 1) typeSources = 'Source';
  }

  const extention = submission.file.ext;
  const video = extention === 'webm' || extention === 'swf' || extention === 'mp4';
  const videoPicture = video ? 'Video' : 'Picture';

  // TODO: better field implementation with map
  embed
    .setColor(orgMessage.embeds[0].color)
    .setTitle('e621 Link')
    .setURL(`https://e621.net/posts/${submission.id}`)
    .setDescription(`**General Tags:** \`\`\`${submission.tags.general.join(', ')}\`\`\``)
    .addField('Rating', `:regional_indicator_${submission.rating}:`, true)
    .addField('Score', `${submission.score.total}`, true)
    .addField('ID', `${submission.id}`, true)
    .addField('Resolution', `${submission.file.width}x${submission.file.height}`, true)
    .addField(typeSources, source)
    .addField(`Full ${videoPicture} link`, submission.file.url)
    .setImage(video ? submission.sample.url : submission.file.url)
    .setFooter({ text: `${videoPicture} from e621.net`, iconURL: config.engine.e621.logo });
  return embed;
}

function buttonHandler(message, interaction, orgContent) {
  // start button collector
  const filter = (i) => interaction.user.id === i.user.id || !interaction.memberPermissions.has('MANAGE_MESSAGES');
  const buttonCollector = message.createMessageComponentCollector({ filter, time: config.commands.buttonTimeout });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'delete') return message.delete();
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) message.edit({ embeds: [orgContent], components: [] });
  });
}

module.exports.run = async (interaction, orgMessage, submission) => {
  // const poolData = await requestPool(submission.pools[0], interaction.channel.nsfw);
  const poolData = null;
  const embed = prepareMessage(submission, orgMessage, poolData);
  const message = await orgMessage.edit({ embeds: [embed], components: [buttons], fetchReply: true });
  buttonHandler(message, interaction, embed);
};

module.exports.data = { subcommand: true };
