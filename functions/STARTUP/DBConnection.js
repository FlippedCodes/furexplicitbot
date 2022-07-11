const Sequelize = require('sequelize');

module.exports.run = async () => {
  LOG('[DB] Connecting...');

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
  LOG('[DB] Connected!');

  global.sequelize = sequelize;
};

module.exports.data = {
  name: 'DBConnection',
};
