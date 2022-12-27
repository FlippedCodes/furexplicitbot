async function countChannels(autopostfasubmission, serverID) {
  const result = await autopostfasubmission.findAndCountAll({ where: { serverID } }).catch(ERR);
  return result.count;
}

async function addAutopost(autopostfasubmission, artistID, channelID, serverID, maxChannels) {
  const date = new Date();
  const nextEvent = date.getTime();
  if (await countChannels(autopostfasubmission, serverID) > maxChannels) return 1;
  if (await autopostfasubmission.findOne({ where: { channelID } }).catch(ERR)) return 2;
  await autopostfasubmission.findOrCreate({
    where: { artistID, channelID },
    defaults: {
      tags: serverID, interval, nextEvent,
    },
  }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, autopostfasubmission) => {
  if (!DEBUG) await interaction.deferReply({ ephemeral: true });
  const channel = await interaction.options.getChannel('channel');
  const artistID = await interaction.options.getString('artistid');
  if (!channel.nsfw) return messageFail(interaction, uwu('Please make sure your channels is marked as ßßage-restricted!'));
  // TODO: Verify artistid and watch artist for updates
  const added = await addAutopost(autopostfasubmission, artistID, channel.id, interaction.guild.id, config.commands.faAtopost.maxChannels);
  switch (added) {
    case true: return messageSuccess(interaction, uwu(`You are now watching ßß\`${artistID}\` in <#${channel}>. The first post will appear with the next uplaod of the artist.`));
    case 1: return messageFail(interaction, uwu(`You already watch the max of ßß${config.commands.faAutopost.maxArtists} artists in this server!`));
    default: return messageFail(interaction, uwu('Woops, seems like the wizard behind the curtain has tripped! Try again later.'));
  }
};

module.exports.data = { subcommand: true };
