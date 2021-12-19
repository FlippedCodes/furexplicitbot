const rp = require('request-promise');

function buildRequestDBL(client, config) {
  const version = require('../package.json');
  return {
    method: 'POST',
    uri: `${config.botList.discordbotlist.endpoint}${config.clientID}/stats`,
    headers: {
      'User-Agent': `FurExplicitBot/${version.version} by Phil | Flipper#3621 on Discord`,
      Authorization: config.env.get('token_discordbotlist'),
    },
    body: {
      // DISABLED: value is wrong
      // users: client.users.size,
      guilds: client.guilds.cache.size,
    },
    json: true,
  };
}

function buildRequestMD(client, config) {
  const version = require('../package.json');
  return {
    method: 'POST',
    uri: `${config.botList.motiondevelopment.endpoint}bots/${config.clientID}/stats`,
    headers: {
      'User-Agent': `FurExplicitBot/${version.version} by Phil | Flipper#3621 on Discord`,
      'content-type': 'application/json',
      'api-key': config.env.get('token_motiondevelopment'),
    },
    body: { 'server-count': client.guilds.cache.size },
    json: true,
  };
}

module.exports.run = async (client, config) => {
  setInterval(async () => {
    rp(await buildRequestDBL(client, config));
    rp(await buildRequestMD(client, config));
  }, config.botList.heartBeatInterval);
};

module.exports.help = {
  name: 'TCKR_botlistAPI',
};
