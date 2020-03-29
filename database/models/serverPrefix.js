/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('serverPrefix', {
  serverID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  prefix: {
    type: Sequelize.STRING(3),
    allowNull: false,
  },
});
