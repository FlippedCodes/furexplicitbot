/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'autopostfasubmission',
  {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    artistName: Sequelize.TEXT('tiny'),
  },
);
