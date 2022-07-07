const { Login, Rating } = require('furaffinity-api');

Login(process.env.login_fa_cookie_a, process.env.login_fa_cookie_b);

module.exports.run = async (interaction) => {
  if (!DEBUG) await interaction.deferReply();
  if (!interaction.channel.nsfw) return messageFail(interaction, uwu('This command is currenty only available in NSFW channels.'));
  const rating = interaction.channel.nsfw ? Rating.Any : Rating.General;
  const subName = interaction.options.getSubcommand(true);
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, rating);
};

module.exports.data = new CmdBuilder()
  .setName('furaffinity')
  .setDescription('Get pictures frwom furaffinity.')
  .addSubcommand((SC) => SC
    .setName('recent')
    .setDescription('Get the most revent uploaded pictures.')
    .addNumberOption((option) => option
      .setName('amount')
      .setDescription('A maximum o...of 24 can be prowided.')))
  .addSubcommand((SC) => SC
    .setName('search')
    .setDescription('Remove a blacklisted tag.')
    .addStringOption((option) => option
      .setName('search')
      .setDescription('Prowide a search quwerry.')
      .setRequired(true))
    .addNumberOption((option) => option
      .setName('amount')
      .setDescription('A maximum o...of 24 can be prowided.')));
