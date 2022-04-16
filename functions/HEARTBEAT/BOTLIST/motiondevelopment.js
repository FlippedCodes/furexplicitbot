const axios = require('axios');

function sendHeartbeat() {
  axios({
    method: 'post',
    url: `${config.functions.heartbeat.motiondevelopment.endpoint}${client.user.id}/stats`,
    headers: {
      key: process.env.token_motiondevelopment,
      'Content-Type': 'application/json',
      // 'User-Agent': `FurExplicitBot/${config.package.version} by Phil | Flipper#3621 on Discord`,
    },
    data: { guilds: client.guilds.cache.size },
  });
}

module.exports.run = async () => {
  setInterval(() => {
    sendHeartbeat();
  }, config.functions.heartbeat.motiondevelopment.interval);
};

module.exports.data = {
  name: 'motiondevelopment',
};