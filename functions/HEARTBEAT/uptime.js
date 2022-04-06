const axios = require('axios');

module.exports.run = async () => {
  const params = {
    msg: 'OK',
    ping: Math.round(client.ws.ping),
  };
  axios.get(`${config.functions.heartbeat.uptime.endpoint}${process.env.token_uptime}`, { params });
};

module.exports.data = {
  name: 'uptime',
};
