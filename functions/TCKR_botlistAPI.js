const rp = require('request-promise');

function buildRequest(client, config) {
  const version = require('../package.json');
  return {
    method: 'POST',
    uri: `${config.botList.discordbotlist.endpoint}${config.clientID}/stats`,
    headers: {
      'User-Agent': `FurExplicitBot/${version.version} by Phil | Flipper#3621 on Discord`,
      Authorization: config.env.get('token_discordbotlist'),
    },
    body: {
      users: client.users.size,
      guilds: client.guilds.size,
    },
    json: true,
  };
}

module.exports.run = (client, config) => {
  setInterval(async () => {
    rp(await buildRequest(client, config));
  }, config.botList.heartBeatInterval);
};

module.exports.help = {
  name: 'TCKR_botlistAPI',
};
