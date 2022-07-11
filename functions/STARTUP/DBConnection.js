const Sequelize = require('sequelize');

module.exports.run = async () => {
  LOG('[DB] Connecting...');

  const sequelize = await new Sequelize(
    process.env.db_name,
    process.env.db_user,
    process.env.db_passw,
    {
      host: process.env.db_host,
      dialect: process.env.db_dialect,
      logging: DEBUG ? console.log() : DEBUG,
    },
  );
  LOG('[DB] Connected!');

  global.sequelize = sequelize;
};

module.exports.data = {
  name: 'DBConnection',
};
