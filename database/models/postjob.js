/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'postjob',
  {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    tags: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
  },
);
