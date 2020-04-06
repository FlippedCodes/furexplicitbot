const seenchangelog = require('../database/models/seenChangelog');

const errHander = (err) => {
  console.error('ERROR:', err);
};

// post changelog
function postChangelog(message, client) {
  message.channel.send('Hewwo, I hawe been updawted!');
  client.commands.get('changelog').run(client, message)
    .catch(console.log);
}

module.exports.run = async (client, message) => {
  const userID = message.author.id;
  if (!await seenchangelog.findOne({ where: { userID } })) postChangelog(message, client);
  await seenchangelog.findOrCreate({ where: { userID } }).catch(errHander);
};

module.exports.help = {
  name: 'FUNC_seenChangelog',
};
