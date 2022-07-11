// Calls all the functions that are needed for a heartbeat
module.exports.run = () => {
  if (DEBUG) return;
  LOG(`[${module.exports.data.name}] Start sending heartbeats...`);
  // botlists
  // TODO: Better implementation: call on startup or when servercount changes
  // TODO: Generelize function as all are quite simmilar
  client.functions.get('HEARTBEAT_BOTLIST_botsondiscord').run();
  client.functions.get('HEARTBEAT_BOTLIST_discordbotlist').run();
  client.functions.get('HEARTBEAT_BOTLIST_discords').run();
  client.functions.get('HEARTBEAT_BOTLIST_discordbots').run();
  client.functions.get('HEARTBEAT_BOTLIST_motiondevelopment').run();
  // uptime page
  client.functions.get('HEARTBEAT_uptime').run();
  // autopost (e621)
  client.functions.get('HEARTBEAT_autopost').run();
};

module.exports.data = {
  name: 'heartbeat',
  callOn: '-',
};
