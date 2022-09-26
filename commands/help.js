const { EmbedBuilder } = require('discord.js');

module.exports.run = async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle('Halp')
    .setColor('Orange')
    .setDescription(uwu('This command is ßßdeprecated, please use discord embedded slash-commands feature for help instead. ßß(/)'))
    .addField(uwu('Still need help?'), uwu('Join our server here: ßßhttps://discord.gg/fMYD6XR'));
  return reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('help')
  .setDescription('Shows a list of commands. [Deprecated]');
