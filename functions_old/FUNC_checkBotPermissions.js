module.exports.run = async (message, requPerms) => {
  if (message.channel.type === 'dm') return true;
  const botperms = message.guild.me.permissionsIn(message.channel);
  const hasPermissions = botperms.has(requPerms);
  return hasPermissions;
};

module.exports.help = {
  name: 'FUNC_checkBotPermissions',
};
