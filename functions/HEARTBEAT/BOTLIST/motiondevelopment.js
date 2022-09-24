const axios = require('axios');

function sendHeartbeat(guilds) {
  axios({
    method: 'post',
    url: `${config.functions.heartbeat.motiondevelopment.endpoint}${client.user.id}/stats`,
    headers: {
      key: process.env.token_motiondevelopment,
      'Content-Type': 'application/json',
    },
    data: { guilds },
  });
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.motiondevelopment.interval);
};

module.exports.data = {
  name: 'motiondevelopment',
};
