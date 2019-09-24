module.exports.run = async (client, fs) => {
  client.user.setStatus('online');
  if (fs.existsSync('./config/test_token.json')) {
    client.user.setActivity('with the Testaccount from Flipper');
  } else {
    setInterval(() => {
      setTimeout(() => {
        client.user.setActivity(`ower ${client.guilds.reduce((previousCount, currentGuild) => previousCount + currentGuild.memberCount, 0)} members.`, { type: 'WATCHING' });
      }, 20000);
      client.user.setActivity('with \'+help\' command');
    }, 1 * 40000);
  }
};

module.exports.help = {
  name: 'setup_status',
};
