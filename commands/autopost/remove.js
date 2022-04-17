const postcache = require('../../database/models/postcache');

async function removeAutopost(autopostchannel, channelID) {
  if (!await autopostchannel.findOne({ where: { channelID } }).catch(ERR)) return false;
  await postcache.destroy({ where: { channelID } }).catch(ERR);
  await autopostchannel.destroy({ where: { channelID } }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, autopostchannel) => {
  const channelID = interaction.options.getString('channel', true);
  const removed = await removeAutopost(autopostchannel, channelID);
  if (removed) {
    messageSuccess(interaction, 'This channel dowes now no longer autopowst.');
  } else {
    messageFail(interaction, 'This channel doewsn\'t have an autopowst configured!');
  }
};

module.exports.data = { subcommand: true };
