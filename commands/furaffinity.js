const { Login, Submissions, removeFromInbox } = require('furaffinity-api');

Login(process.env.login_fa_cookie_a, process.env.login_fa_cookie_b);

module.exports.run = async (interaction) => {

};

module.exports.data = new CmdBuilder()
  .setName('furaffinity')
  .setDescription('Get pictures frwom furaffinity.')
  .addSubcommand((SC) => SC
    .setName('recent')
    .setDescription('Get the most revent uploaded pictures.')
    .addNumberOption((option) => option
      .setName('ammount')
      .setDescription('A maximum o...of 24 can be fetched.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('remove')
    .setDescription('Remove a blacklisted tag.')
    .addStringOption((option) => option
      .setName('tag')
      .setDescription('Provide a tag to remove.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('list')
    .setDescription('List all blacklisted tags.'));
