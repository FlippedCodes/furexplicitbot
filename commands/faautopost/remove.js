// WARN: TODO: Might be able to remove autoposts from other servers with just their channel ID

const postfacache = require('../../database/models/postfacache');

async function removeAutopost(autopostfasubmission, channelID, artistID) {
  if (!await autopostfasubmission.findOne({ where: { channelID, artistID } }).catch(ERR)) return false;
  await postfacache.destroy({ where: { channelID } }).catch(ERR);
  await autopostfasubmission.destroy({ where: { channelID } }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, autopostfasubmission) => {
  const [channelID, artistID] = interaction.options.getString('channel', true).split('_');
  const removed = await removeAutopost(autopostfasubmission, channelID, artistID);
  if (removed) {
    messageSuccess(interaction, uwu(`\`ßß${artistID}\` will no longer be autoposted in ßß<#${channelID}>`));
  } else {
    messageFail(interaction, uwu('This channel ßßdoesn\'t have an autopost ßßconfigured!'));
  }
};

module.exports.data = { subcommand: true };
