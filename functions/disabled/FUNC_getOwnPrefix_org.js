const prefixCache = new Map();

// const ServerPrefix = require('../../database/models/ServerPrefix');

const config = require('../../config/main.json');

const errHander = (err) => {
  console.error('ERROR:', err);
};

function cacheHandler(serverID, prefix) {
  prefixCache.set(serverID, prefix);
  setTimeout(() => prefixCache.delete(serverID).catch(), 600000);
}

module.exports.run = async (serverID) => {
  if (prefixCache.has(serverID)) return prefixCache.get(serverID);
  const DBEentry = await ServerPrefix.findOne({ where: { serverID } }).catch(errHander);
  if (DBEentry) {
    const prefix = DBEentry.prefix;
    cacheHandler(serverID, prefix);
    return prefix;
  }
  return config.prefix.default;
};

module.exports.help = {
  name: 'FUNC_getOwnPrefix',
};
