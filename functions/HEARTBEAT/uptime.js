const axios = require('axios');

const params = (pingRaw) => (
  {
    status: 'up',
    msg: 'OK',
    ping: Math.round(pingRaw),
  }
);

function sendHeartbeat(uptimeToken) {
  axios.get(`${config.functions.heartbeat.uptime.endpoint}${uptimeToken}`, { params: params(client.ws.ping) });
}

module.exports.run = async () => {
  // input is a json array: "['token1', 'token2', ...]"
  const uptimeToken = JSON.parse(process.env.token_uptime)[currentShardID];
  if (!uptimeToken) return LOG('No Uptime code available for my shard!');
  setInterval(() => {
    sendHeartbeat(uptimeToken);
  }, config.functions.heartbeat.uptime.interval * 1000);
};

module.exports.data = {
  name: 'uptime',
};
