/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('serverTagsBlacklist', {
  serverID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  tag: {
    type: Sequelize.STRING(3),
    allowNull: false,
  },
});
