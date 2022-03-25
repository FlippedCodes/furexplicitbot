// TODO: Eventually also offer a App link inside of discord to look for the source

const { MessageEmbed } = require('discord.js');

const axios = require('axios');

function checkURL(orgURL, allowedFiletypes) {
  const url = new URL(orgURL);
  const filename = url.pathname.split('/').reverse()[0];
  const ext = filename.slice(filename.lastIndexOf('.') + 1, filename.length);
  const result = allowedFiletypes.includes(ext);
  return result;
}

const api = axios.create({
  baseURL: config.commands.source.uri,
  timeout: 5000,
  headers: { 'User-Agent': `${config.package.name}/${config.package.version}` },
});

async function getSource(link, nsfw) {
  const params = config.commands.source.params;
  params.url = link;
  // Unfortunatly the api still posts nsfw content
  // params.hide = nsfw ? 0 : 3;
  params.hide = 0;
  params.api_key = process.env.SauceNaotoken;

  // TODO: add catch for better error handling if website refuses service
  const awnser = await api.get('', { params });
  if (awnser.error) return null;
  const results = awnser.data.results;
  if (results.length === 0) return null;
  // sort above 85%
  const preSort = results.filter((res) => res.header.similarity <= config.commands.source.minSimilarity);
  // check for e621 post, because trusted
  const e6post = preSort.filter((res) => res.header.index_id === config.commands.source.e621Index);

  // const activePost = e6post.length ? e6post[0] : preSort[0];
  // const imageFinderCnfg = config.imageFinder;
  // const similarity = result.similarity;
  // if (similarity < imageFinderCnfg.minSimilarity) return null;
  // const post = result.sources[0];
  // post.website = imageFinderCnfg.websiteCodes[post.websiteid];
  // post.similarity = similarity;
  return e6post.length ? e6post[0] : preSort[0];
}

module.exports.run = async (interaction) => {
  // AWAIT: We are waiting for discord to implement a better way to send images alongside command or Discord.JS support for Apps
  // if (message.attachments.array()[0]) { link = message.attachments.array()[0].url; } else {
  //   return messageFail(
  //     interaction,
  //     `Command usage:
  //   \`\`\`${prefix}${module.exports.help.name} (LINK/)attachment\`\`\``);
  // }
  if (!interaction.channel.nsfw) return messageFail(interaction, uwu('Sorry, but this feature is only supported in NSFW marked rooms. ßßuwu'));
  const link = interaction.options.getString('url');

  const fileTypes = config.commands.source.allowedFiletypes;
  if (!checkURL(link, fileTypes)) return messageFail(interaction, uwu(`Sorry, I don't support this filetype. Only ßß${fileTypes.join(', ßß')}`));
  const source = await getSource(link, interaction.channel.nsfw);
  if (!source || !source.data.source.startsWith('http')) return messageFail(interaction, uwu('Sorry, but i wasn\'t able to find your picture. ßßuwu'));
  const embed = new MessageEmbed()
    .setColor(0xFAAF3A)
    .setAuthor({ name: `Artist: ${source.data.creator} [${Math.round(source.header.similarity)}% similarity]` })
    .setTitle('URL')
    .setURL(source.data.source)
    .setThumbnail(source.header.thumbnail)
    .setFooter({ text: 'Found with saucenao.com', iconURL: config.commands.source.searcherLogo });
  const msg = await reply(interaction, { embeds: [embed], fetchReply: true });
  msg.react('❌');
};

module.exports.data = new CmdBuilder()
  .setName('source')
  .setDescription('Finds the source of a picture.')
  .addStringOption((option) => option
    .setName('url')
    .setDescription('A URL to the picture.')
    .setRequired(true));
