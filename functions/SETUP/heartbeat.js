// Calls all the functions that are needed for a heartbeat
module.exports.run = async () => {
  if (DEBUG) return;
  LOG(`[${module.exports.data.name}] Start sending heartbeats...`);
  // botlists
  const guildCountsArr = await client.shard.fetchClientValues('guilds.cache.size');
  const guildCount = guildCountsArr.reduce((previousCount, currentCount) => previousCount + currentCount, 0);
  // TODO: Better implementation: call on startup or when servercount changes
  // TODO: Generelize function as all are quite simmilar
  client.functions.get('HEARTBEAT_BOTLIST_botsondiscord').run(guildCount);
  client.functions.get('HEARTBEAT_BOTLIST_discordbotlist').run(guildCount);
  client.functions.get('HEARTBEAT_BOTLIST_discords').run(guildCount);
  client.functions.get('HEARTBEAT_BOTLIST_discordbots').run(guildCount);
  client.functions.get('HEARTBEAT_BOTLIST_motiondevelopment').run(guildCount);
  // uptime page
  client.functions.get('HEARTBEAT_uptime').run();
  // autopost (e621)
  client.functions.get('HEARTBEAT_autopost').run();
};

module.exports.data = {
  name: 'heartbeat',
  callOn: '-',
};
