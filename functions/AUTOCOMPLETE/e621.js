// TODO: better implementation of duplicate code

module.exports.run = async (interaction) => {
  const command = interaction.options.getFocused(true);
  const response = await client.functions.get(`AUTOCOMPLETE_RESOLVE_e621_${command.name}`).run(command.value).catch(ERR);
  return interaction.respond(response);
};

module.exports.data = {
  name: 'e621',
};
