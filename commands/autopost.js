const autopostchannel = require('../database/models/autopostchannel');

const servertagsblacklist = require('../database/models/servertagsblacklist');

module.exports.run = async (interaction) => {
  const subName = interaction.options.getSubcommand(true);
  if (subName !== 'list' && !interaction.memberPermissions.has('MANAGE_GUILD')) {
    messageFail(interaction, uwu('You don\'t hawe access to this command ßßòwó ßß\nYou need at least the Manage Server permission.'));
    return;
  }
  const tag = interaction.options.getString('tag');
  const tagCleanup = tag ? tag.replaceAll(' ', '_') : null;
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, autopostchannel, servertagsblacklist);
};

module.exports.data = new CmdBuilder()
  .setName('autopost')
  .setDescription('Autopost e621 pictures in a channel.')
  .addSubcommand((SC) => SC
    .setName('add')
    .setDescription('Add a new autopost channel.')
    .addStringOption((option) => option
      .setName('tag')
      .setDescription('Provide a tag to add.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('remove')
    .setDescription('Remove a autopost channel.')
    .addStringOption((option) => option
      .setName('channel')
      .setDescription('Provide a autopost to remove.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('list')
    .setDescription('List all autopost channels.'));
