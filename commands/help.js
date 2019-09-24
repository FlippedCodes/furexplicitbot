module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  let embed = new RichEmbed()
    .setAuthor('How to use me:')
    .setColor(message.member.displayColor)
    .addField('E621', `
      ${config.prefix}e6 (AMMOUNT) TAGS
      You can requwest up to 10 pictures at the twime.
      The ammount is alternatiwe and doewsn't need to be prowidewd.
      `)
    .addField('FurAffinity', `
      ${config.prefix}fa help
      Get additional hewlp for furaffinity.
      `)
    .addField('About', `
      ${config.prefix}about
      Learn mowre about me.
      `)
    .addField('Need Help?', `
      I've got you covered.
      Join the help server here: https://discord.gg/fMYD6XR
      `)
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'help',
};
