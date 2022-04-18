const { Browse } = require('furaffinity-api');

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const buttons = new MessageActionRow()
  .addComponents([
    new MessageButton()
      .setCustomId('delete')
      .setEmoji('❌')
      .setLabel('Delete')
      .setStyle('SECONDARY'),
  ]);

function prepareMessage(submission) {
  const faConfig = config.engine.furaffinity;
  const embed = new MessageEmbed()
    .setAuthor({ name: submission.author.name, url: submission.author.url })
    .setColor(faConfig.color)
    .setTitle(`${submission.title} [Link]`)
    .setURL(submission.url)
    .addField('Preview', '🔽')
    .setImage(submission.thumb.large)
    .setFooter({ text: 'Picture from FurAffinity.net', icon_url: faConfig.color });
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

module.exports.run = async (interaction) => {
  if (!DEBUG) await interaction.deferReply();
  const ammoumt = interaction.options.getNumber('ammount', false) || 1;
  if (ammoumt > 24) return messageFail(interaction, uwu('You can only request a maximum of ßß24 images at the time.'), null, true);
  const rating = interaction.channel.nsfw ? 7 : 1;
  const pics = await Browse({ perpage: 24, rating });
  pics.reverse().slice(-ammoumt).forEach(async (submission, i) => {
    const embed = prepareMessage(submission);
    const message = await reply(interaction, { embeds: [embed], components: [buttons], fetchReply: true }, i);
    buttonHandler(message, interaction, embed);
  });
};

module.exports.data = { subcommand: true };
