module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  const prefix = await client.functions.get('FUNC_getPrefix').run(message);
  const embed = new RichEmbed()
    .setAuthor('How to uwse me:');
  if (message.channel.type !== 'dm') embed.setColor(message.member.displayColor);
  // creating embed fields for every command
  client.commands.forEach((CMD) => {
    if (!CMD.help.title) return;
    embed.addField(CMD.help.title,
      `\`${prefix}${CMD.help.name} ${CMD.help.usage || ''}\`
      ${CMD.help.desc}`, false);
  });
  embed.addField('Have an idewa for me? 💡', `
      Down't lewt it dwie!
      Suggest it here: https://forms.gle/eh4fS8Qd8XmGqEi38
      `)
    .addField('Need Help?', `
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
