module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  const embed = new RichEmbed()
    .setAuthor('How to uwse me:')
    .setColor(message.member.displayColor);
    // creating embed fields for every command
  client.commands.forEach((CMD) => {
    if (!CMD.help.title) return;
    embed.addField(CMD.help.title,
      `\`${config.defaultPrefix}${CMD.help.name} ${CMD.help.usage || ''}\`
      ${CMD.help.desc}`, false);
  });
  embed.addField('Need Help?', `
      I've got you cowered.
      Join the halp serwer here: https://discord.gg/fMYD6XR
      `)
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'help',
};
