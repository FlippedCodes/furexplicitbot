const rp = require('request-promise');

// prepares message embed
function messageBuilder(config, RichEmbed, title, url, image) {
  return new RichEmbed()
    .setTitle(title)
    .setURL(url)
    .setImage(image)
    .setColor(config.ib.color)
    .setFooter('Inkbunny', config.ib.logo)
    .setTimestamp();
}

// sends note
function noteSend(message, channel, RichEmbed) {
  let embed = new RichEmbed().setDescription(message);
  channel.send({ embed });
}

// prepares message values and sends
function messageSend(config, message, RichEmbed, result) {
  result.submissions.forEach((submission) => {
    let url = `https://inkbunny.net/s/${submission.submission_id}`;
    let title = `Artist: ${submission.username} [Inkbunny link]`;
    let embed = messageBuilder(config, RichEmbed, title, url, submission.file_url_full);
    message.channel.send({ embed })
      .then((sentMessage) => sentMessage.react('❌'));
  });
}

// runs http request
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

// assembles the guest login querry
async function loginAssembly() {
  let args = 'username=guest&password=';
  let result = await httpRequest('login', args);
  return result.sid;
}

// assembles the SFW search querry
function SFWRatingAssembly(sid) {
  let args = `sid=${sid}&tag[2]=no&tag[3]=no&tag[4]=no&tag[5]=no`;
  httpRequest('userrating', args);
}

// assembles the NSFW search querry
function NSFWRatingAssembly(sid) {
  let args = `sid=${sid}&tag[2]=yes&tag[3]=yes&tag[4]=yes&tag[5]=yes`;
  httpRequest('userrating', args);
}

// checking if channel is nsfw
function checkChannelRating(client, channel) {
  let sidSFW = client.IB_SID_SFW;
  let sidNSFW = client.IB_SID_NSFW;
  switch (channel.nsfw) {
    case true: return sidNSFW;
    case false: return sidSFW;
    default: return sidSFW;
  }
}

function limmiter(ammount, config, message, RichEmbed) {
  let newAmmount = ammount;
  if (ammount > 10 && message.author.id !== config.owner) {
    let note = 'You can only requwest a maximum of 10 images at the twime. I hawe limited it fowor you ^w^';
    noteSend(note, message.channel, RichEmbed);
    newAmmount = 10;
  }
  return newAmmount;
}

// assembles the search querry
async function seachAssembly(sid, searchQuery, ammount) {
  let postTypes = '1,2,3,4,5,8,9';
  let args = `sid=${sid}&text=${searchQuery}&submissions_per_page=${ammount}&random=yes&type=${postTypes}`;
  let result = await httpRequest('search', args);
  return result;
}

// checking session ID
async function checkSID(client) {
  if (client.IB_SID_SFW && client.IB_SID_NSFW) {
    [client.IB_SID_SFW, client.IB_SID_NSFW].forEach(async (SID) => {
      let args = `sid=${SID}&submissions_per_page=0&no_submissions=yes`;
      let result = await httpRequest('search', args);
      if (result.error_code === 2) {
        SID = await loginAssembly();
        SFWRatingAssembly(SID);
      }
    });
  } else {
    // generates, when first request is made
    if (!client.IB_SID_SFW) {
      client.IB_SID_SFW = await loginAssembly();
      SFWRatingAssembly(client.IB_SID_SFW);
    }
    if (!client.IB_SID_NSFW) {
      client.IB_SID_NSFW = await loginAssembly();
      NSFWRatingAssembly(client.IB_SID_NSFW);
    }
  }
}

// TEMP: Editor note
function editorNote(message, RichEmbed) {
  let note = '**Editor note:** This command is still in beta. There are going to be features added soon. In the meantime, you might experience long image waiting times.';
  let embed = new RichEmbed().setDescription(note);
  message.channel.send({ embed });
}

module.exports.run = async (client, message, args, config, RichEmbed, messageOwner) => {
  editorNote(message, RichEmbed);
  await checkSID(client);
  // getting loading emoji
  let loadingEmoji = client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji);
  message.react(loadingEmoji).then(async (reaction_loading) => {
    // checking for requested ammounts of pictures and parses tags
    let tags = args.join(' ');
    let [ammount] = args;
    if (isNaN(ammount) || ammount <= 0) ammount = 1;
    else tags = tags.slice(ammount.length + 1);
    let result = await seachAssembly(
      await checkChannelRating(client, message.channel),
      tags,
      limmiter(ammount, config, message, RichEmbed),
    );
    messageSend(config, message, RichEmbed, result);
    await reaction_loading.remove(client.user);
  })
    .catch((err) => {
      message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu\'')
        .then(() => message.react('❌'));
      console.error(err);
    });
};

module.exports.help = {
  name: 'inkbunny_core',
};
