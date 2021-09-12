const fs = require('fs');

module.exports.run = async (client, message) => {
  fs.readFile('./config/about.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      message.react('❌');
      return;
    }
    message.channel.send(data);
  });
};

module.exports.help = {
  name: 'about',
  title: 'About',
  desc: 'Learn mowre about me!',
};
