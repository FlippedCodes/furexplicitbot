const rp = require('request-promise');

function messageBuilder(config, RichEmbed, title, url, image) {
  return new RichEmbed()
    .setTitle(title)
    .setURL(url)
    .setImage(image)
    .setColor(config.ib.color)
    .setFooter('Inkbunny', config.ib.logo)
    .setTimestamp();
}

function messageSend(config, message, RichEmbed, result) {
  result.submissions.forEach((submission) => {
    let url = `https://inkbunny.net/s/${submission.submission_id}`;
    let title = `Artist: ${submission.username} [Inkbunny link]`;
    let embed = messageBuilder(config, RichEmbed, title, url, submission.file_url_full);
    message.channel.send({ embed })
      .then((sentMessage) => sentMessage.react('❌'));
  });
}

async function httpRequest(apiFunction, args) {
  let uri = `https://inkbunny.net/api_${apiFunction}.php?output_mode=json&${args}`;
  console.log(uri);
  let request = {
    method: 'GET',
    uri,
    headers: { 'User-Agent': 'DiscordBot - FurExplicitBot' },
    json: true,
  };
  let result = await rp(request);
  return result;
}

async function loginAssembly() {
  let args = 'username=guest&password=';
  let result = await httpRequest('login', args);
  return result.sid;
}

function NSFWRatingAssembly(sid) {
  let args = `sid=${sid}&tag[2]=yes&tag[3]=yes&tag[4]=yes&tag[5]=yes`;
  httpRequest('userrating', args);
}

function SFWRatingAssembly(sid) {
  let args = `sid=${sid}&tag[2]=no&tag[3]=no&tag[4]=no&tag[5]=no`;
  httpRequest('userrating', args);
}

// checking if channel is nsfw
function checkChannelRating(sid, channel) {
  if (channel.nsfw === true) NSFWRatingAssembly(sid);
  else SFWRatingAssembly(sid);
}

async function seachAssembly(channel, sid, searchQuery, ammount) {
  await checkChannelRating(sid, channel);
  let postTypes = '1,2,3,4,5,8,9';
  let args = `sid=${sid}&text=${searchQuery}&submissions_per_page=${ammount}&random=yes&type=${postTypes}`;
  let result = await httpRequest('search', args);
  return result;
}

// checking session ID
async function checkSID(client) {
  // generates, when first request is made
  if (!client.IB_SID) client.IB_SID = await loginAssembly();
  // checks if SID is still valid
  let args = `sid=${client.IB_SID}&submissions_per_page=0&no_submissions=yes`;
  let result = await httpRequest('search', args);
  if (result.error_code === 2) await loginAssembly();
}

module.exports.run = async (client, message, args, config, RichEmbed, messageOwner) => {
  await checkSID(client);
  // getting loading emoji
  let loadingEmoji = client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji);
  message.react(loadingEmoji).then(async (reaction_loading) => {
    // checking for requested ammounts of pictures and parses tags
    let tags = args.join(' ');
    let [ammount] = args;
    if (isNaN(ammount) || ammount <= 0) ammount = 1;
    else tags = tags.slice(ammount.length + 1);
    let result = await seachAssembly(message.channel, client.IB_SID, tags, ammount);
    messageSend(config, message, RichEmbed, result);
  });
};

module.exports.help = {
  name: 'inkbunny_core',
};
