const usedRecently = new Set();

function timeout(id, time) {
  usedRecently.add(id);
  setTimeout(() => usedRecently.delete(id), time);
}

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
    // rate limit commands
    if (usedRecently.has(interaction.author.id)) return messageFail(interaction, uwu('Sorry, but you can\'t use me that often. Please wait 3 seconds between commands.'));
    timeout(interaction.author.id, 3000);
    // check, if user has seen changelo yet
    client.functions.get('MESSAGE_seenChangelog').run(interaction).catch(ERR);
    command.run(interaction).catch(ERR);
    return;
  }
};

module.exports.data = {
  name: 'isCommand',
};
