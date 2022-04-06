const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
  const embed = new MessageEmbed()
    .setTitle('Halp')
    .setColor('ORANGE')
    .setDescription(uwu('This command is deprecated, please use discord embedded slash-commands feature instead.'))
    .addField(uwu('Still need help?'), uwu(`
  Join our server here: ßßhttps://discord.gg/fMYD6XR`));
  return reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('help')
  .setDescription('Shows a list of commands. [Deprecated]');
