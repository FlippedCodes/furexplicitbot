const Sequelize = require('sequelize');

const testToken = '../config/config.json';

const config = require('../config/main.json');

console.log('[DB] Connecting...');
let database;
let user;
let password;
let host;
let dialect;
if (config.env.get('inDev')) {
  const DBCredentials = require(testToken).development;
  database = DBCredentials.database;
  user = DBCredentials.username;
  password = DBCredentials.password;
  host = DBCredentials.host;
  dialect = DBCredentials.dialect;
} else {
  database = process.env.DB_name;
  user = process.env.DB_user;
  password = process.env.DB_passw;
  host = process.env.DB_host;
  dialect = process.env.DB_dialect;
}
const sequelize = new Sequelize(
  database, user, password, { host, dialect, logging: config.env.get('inDev') },
);
console.log('[DB] Connected!');

module.exports = sequelize;
global.sequelize = sequelize;
