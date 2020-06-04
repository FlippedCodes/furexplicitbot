// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

function checkURL(orgURL, allowedFiletypes) {
  const url = new URL(orgURL);
  const filename = url.pathname.split('/').reverse()[0];
  const ext = filename.split('.')[1];
  const result = allowedFiletypes.includes(ext);
  return result;
}

module.exports.run = async (client, message, args, config, RichEmbed) => {
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for now server only.');
  if (!message.channel.nsfw) return messageFail(message, 'I\'m sowwy, bwut thwis iws not yewt awailable for SFW rooms. uwu');
  const prefix = await client.functions.get('FUNC_getPrefix').run(message);
  let [link] = args;
  if (!link) {
    if (message.attachments.array()[0]) { link = message.attachments.array()[0].url; } else {
      return messageFail(message,
        `Command usage: 
      \`\`\`${prefix}${module.exports.help.name} (LINK/)attachment\`\`\``);
    }
  }
  if (!checkURL(link, config.imageFinder.allowedFiletypes)) return messageFail(message, `Sowwy, I down't support thwis filetype. Ownly ${config.imageFinder.allowedFiletypes.join(', ')}`);
  const source = await client.functions.get('FUNC_getSource').run(link);
  if (!source) return messageFail(message, 'Sowwy, i cawn\'t find your pic. uwu');
  const site = config[source.website];
  const embed = new RichEmbed()
    .setColor(site.color)
    .setAuthor(`${source.artist} [${Math.round(source.similarity)}% similarity]`, null, `${config.imageFinder.websiteEndpoint}${link}`)
    .setTitle(source.title)
    .setURL(source.source)
    .setImage(`${config.imageFinder.picEndpoint}${source.sha1}.jpg`)
    .setFooter(`on ${site.label} | Found with kheina.com`, site.logo);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'source',
  title: 'Find source',
  usage: 'LINK/attachment',
  desc: 'Finds the source to a picture.',
};
