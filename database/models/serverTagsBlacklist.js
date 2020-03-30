/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('serverTagsBlacklist', {
  serverID: {
    type: Sequelize.STRING(30),
    allowNull: false,
    primaryKey: true,
  },
  tag: {
    type: Sequelize.STRING(3),
    allowNull: false,
  },
});
