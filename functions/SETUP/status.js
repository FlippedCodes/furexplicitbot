module.exports.run = async () => {
  if (DEBUG) return;
  LOG(`[${module.exports.data.name}] Setting status...`);
  await client.user.setStatus('online');
  await client.user.setActivity(`${client.guilds.cache.size} servers.`, { type: 'LISTENING' });
  // TODO: sharing version
  // const guildCountsArr = await client.shard.fetchClientValues('guilds.cache.size');
  // const guildCounts = guildCountsArr.reduce((previousCount, currentCount) => previousCount + currentCount, 0);
  // await client.user.setActivity(`${guildCounts} servers.`, { type: 'LISTENING' });
  console.log(`[${module.exports.data.name}] Status set!`);
  LOG(`[${module.exports.data.name}] Status set!`);
};

module.exports.data = {
  name: 'status',
  callOn: '-',
};
