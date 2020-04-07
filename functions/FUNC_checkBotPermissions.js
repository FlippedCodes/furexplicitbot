module.exports.run = async (message) => {
  if (message.channel.type === 'dm') return true;
  const botperms = message.guild.me.permissionsIn(message.channel);
  const hasPermissions = botperms.has('SEND_MESSAGES');
  return hasPermissions;
};

module.exports.help = {
  name: 'FUNC_checkBotPermissions',
};
