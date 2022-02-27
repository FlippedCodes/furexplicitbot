const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
  const embed = new MessageEmbed()
    .setTitle('Halp')
    .setColor(0xFAAF3A)
    .setDescription(uwu('This command is deprecated, please use discord embedded slash-commands feature instead.'))
    .addField(uwu('Still need help?'), uwu(`
  Read the wiki here: ßßhttps://github.com/FlippedCode/agent-black/wiki
  or join our server here: ßßhttps://discord.gg/QhfnAWgEMS`));
  return reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('help')
  .setDescription('Shows a list of commands. [Deprecated]');
