const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const IBconfig = config.engine.inkbunny;

const buttons = new MessageActionRow()
  .addComponents([
    new MessageButton()
      .setCustomId('delete')
      .setEmoji('✖️')
      .setLabel('Delete')
      .setStyle('DANGER'),
  ]);

function prepareMessage(submission, orgMessage, poolData) {
  const embed = new MessageEmbed()
    .setColor(orgMessage.embeds[0].color)
    .setTitle(`${submission.title}`)
    .setURL(`https://inkbunny.net/s/${submission.submission_id}`)
    .setAuthor({ name: `Artist: ${submission.username}`, url: `https://inkbunny.net/${submission.username}` })
    // .setDescription(`**Tags:** \`\`\`${formatTags(submission.tags)}\`\`\``)
    .addField('Type', `${submission.type_name}`, true)
    // .addField('Mime type', `${submission.mimetype}`, true)
    .addField('Rating', `:regional_indicator_${submission.rating_name.toLowerCase().slice(0, 1)}:`, true)
    // .addField('Score', `${submission.score}`, true)
    .addField('ID', `${submission.submission_id}`, true)
    // .addField('Resolution', `${submission.width}x${submission.height}`, true)
    // .addField(typeSources, source)
    .addField('Full picture link', submission.file_url_full)
    .setImage(submission.file_url_full)
    .setFooter({ text: 'Picture from inkbunny.net', iconURL: IBconfig.logo });
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
