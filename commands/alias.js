module.exports.run = async (client, message, args, config, RichEmbed, messageOwner, fa_token_A, fa_token_B) => {
  // post help text
  const embed = new RichEmbed()
    .setAuthor('Command aliases:')
    .setColor(message.member.displayColor)
    .addField('e621', 'e, e6, e62, e621')
    .addField('InkBunny', 'ib, ibun, ibunny, inkb, inkbunny')
    .addField('Rule34', 'r, 34, r34, ru34, rule34')
    .addField('FurAffinity', 'f, fa, fura, furaffinity');
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'alias',
  title: 'Command aliases',
  desc: 'Showos the alteraniwe, shorter commands.',
};
