// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

module.exports.run = async (client, message, args, config) => {
  // check DM
  if (message.channel.type === 'dm') return messageFail(client, message, 'This comamnd is for servers only.');
  const [subcmd] = args;
  const commandValues = ['add', 'remove', 'list'];
  if (commandValues.includes(subcmd)) {
    client.functions.get(`CMD_hub_${subcmd}`)
      .run(client, message, args, config);
  } else {
    const currentCMD = module.exports.help;
    messageFail(client, message, CommandUsage(config.prefix, currentCMD.name, currentCMD.usage));
  }
};

module.exports.help = {
  name: 'blacklist',
  title: 'Manage tags',
  usage: 'add|remove|list',
  desc: 'Manage blacklisted tags in this server',
};
