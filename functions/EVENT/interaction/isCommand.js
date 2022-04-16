module.exports.run = async (interaction) => {
  // debug protection
  if (!DEBUG && interaction.commandName.includes('_dev')) return;
  if (DEBUG && !interaction.commandName.includes('_dev')) return;

  const mainCMD = interaction.commandName.replace('_dev', '');
  const command = client.commands.get(DEBUG ? mainCMD : interaction.commandName);
  if (command) {
    // if debuging trigger application thinking
    // TEMP: set to false to test some public commands
    if (DEBUG) await interaction.deferReply({ ephemeral: false });
    // check, if user has seen changelo yet
    client.functions.get('MESSAGE_seenChangelog').run(interaction).catch(ERR);
    command.run(interaction).catch(ERR);
    return;
  }
};

module.exports.data = {
  name: 'isCommand',
};
