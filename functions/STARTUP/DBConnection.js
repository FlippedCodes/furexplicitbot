const Sequelize = require('sequelize');

module.exports.run = async () => {
  console.log('[DB] Connecting...');

  const sequelize = await new Sequelize(
    process.env.DBdatabase,
    process.env.DBusername,
    process.env.DBpassword,
    {
      host: process.env.DBhost,
      dialect: 'mysql',
      logging: DEBUG ? console.log() : DEBUG,
    },
  );
  console.log('[DB] Connected!');

  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');

  global.sequelize = sequelize;
};

module.exports.data = {
  name: 'DBConnection',
};
