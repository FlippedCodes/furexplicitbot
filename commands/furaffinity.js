const { Login } = require('furaffinity-api');

Login(process.env.login_fa_cookie_a, process.env.login_fa_cookie_b);

module.exports.run = async (interaction) => {
  const subName = interaction.options.getSubcommand(true);
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction);
};

module.exports.data = new CmdBuilder()
  .setName('furaffinity')
  .setDescription('Get pictures frwom furaffinity.')
  .addSubcommand((SC) => SC
    .setName('recent')
    .setDescription('Get the most revent uploaded pictures.')
    .addNumberOption((option) => option
      .setName('ammount')
      .setDescription('A maximum o...of 24 can be fetched.')));
// FIXME: https://github.com/recallfuture/furaffinity-api/issues/13
// .addSubcommand((SC) => SC
//   .setName('search')
//   .setDescription('Remove a blacklisted tag.')
//   .addStringOption((option) => option
//     .setName('search')
//     .setDescription('Prowide a search quwerry.')
//     .setRequired(true))
//   .addNumberOption((option) => option
//     .setName('ammount')
//     .setDescription('A maximum o...of 24 can be fetched.')));
