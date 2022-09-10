const axios = require('axios');

function sendHeartbeat(guildCount) {
  axios({
    method: 'post',
    url: `${config.functions.heartbeat.discordbots.endpoint}${client.user.id}/stats`,
    headers: {
      Authorization: process.env.token_discordbots,
      'Content-Type': 'application/json',
      'User-Agent': `FurExplicitBot/${config.package.version} by Phil | Flipper#3621 on Discord`,
    },
    data: { guildCount },
  });
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.discordbots.interval);
};

module.exports.data = {
  name: 'disordbots',
};
