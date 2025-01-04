require('./functions/telemetry');

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', { token: process.env.token_discord });

manager.spawn({
  delay: 10 * 1000,
  timeout: 60 * 1000,
});

manager.on('shardCreate', (shard) => {
  shard.on('spawn', () => {
    console.log(`[SHARD MGR] Launched shard ${shard.id}`);
    shard.send({ type: 'shardID', data: { shardID: shard.id } });
  });
});
