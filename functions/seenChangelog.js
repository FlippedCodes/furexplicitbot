// post changelog
function postChangelog(message, client) {
  message.channel.send('Hewwo, I hawe been updawted!');
  client.commands.get('changelog').run(client, message)
    .catch(console.log);
}

// add user
function addUser(ID, DB) {
  DB.query(`INSERT INTO seenChangelog (ID, seen) VALUES ('${ID}', '1')`);
}

// update user
function updateUser(ID, DB) {
  DB.query(`UPDATE seenChangelog SET seen = '1' WHERE ID = '${ID}' AND seen = '0'`);
}

module.exports.run = async (client, message, DB) => {
  let ID = message.author.id;
  DB.query(`SELECT * FROM seenChangelog WHERE ID = '${ID}'`, (err, rows) => {
    if (err) throw err;
    // check, if user entry exist
    if (rows[0]) {
      // check, if existing user entry seen changelog
      if (rows[0].seen === 1) return;
      else {
        updateUser(ID, DB);
        postChangelog(message, client);
      }
    } else {
      addUser(ID, DB);
      postChangelog(message, client);
    }
  });
};

module.exports.help = {
  name: 'seenChangelog',
};
