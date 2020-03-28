/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('SeenChangelog', {
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
