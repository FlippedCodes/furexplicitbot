const fs = require('fs');

module.exports.run = async (interaction) => {
  fs.readFile(config.commands.about.text, 'utf8', (err, content) => {
    if (err) {
      console.log(err);
      messageFail(interaction, uwu('Oh, no! Something went wrong. Sorry about that :('));
      return;
    }
    messageSuccess(interaction, uwu(content), 'ORANGE', true);
  });
};

module.exports.data = new CmdBuilder()
  .setName('about')
  .setDescription('Learn more about me!');
