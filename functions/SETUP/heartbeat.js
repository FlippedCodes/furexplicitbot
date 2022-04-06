module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Start sending heartbeats...`);
  // setInterval(() => {
  //   client.functions.get('HEARTBEAT_BOTLIST_discordbotlist').run();
  //   client.functions.get('HEARTBEAT_BOTLIST_discordbotlist').run();
  // }, config.functions.heartbeat.uptime.botlist.interval);

  setInterval(() => {
    client.functions.get('HEARTBEAT_uptime').run();
  }, config.functions.heartbeat.uptime.interval);
};

module.exports.data = {
  name: 'heartbeat',
  callOn: '-',
};
