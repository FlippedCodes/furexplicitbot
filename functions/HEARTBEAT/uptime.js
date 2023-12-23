const axios = require('axios');

const params = (pingRaw) => (
  {
    status: 'up',
    msg: 'OK',
    ping: Math.round(pingRaw),
  }
);

function sendHeartbeat() {
  // env token_uptime is a json array: "['token1', 'token2', ...]"
  axios.get(`${config.functions.heartbeat.uptime.endpoint}${JSON.parse(process.env.token_uptime)[currentShardID]}`, { params: params(client.ws.ping) });
}

module.exports.run = async () => {
  sendHeartbeat();
  setInterval(() => {
    sendHeartbeat();
  }, config.functions.heartbeat.uptime.interval * 1000);
};

module.exports.data = {
  name: 'uptime',
};
