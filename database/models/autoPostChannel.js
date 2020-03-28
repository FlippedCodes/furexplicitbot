/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('autoPostChannel', {
  channelID: {
    type: Sequelize.STRING(30),
    primary: true,
    allowNull: false,
  },
  serverID: {
    type: Sequelize.STRING(30),
    primary: true,
    allowNull: false,
  },
  nextEvent: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  intervall: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
},
{
  uniqueKeys: {
    autoPostUnique: {
      fields: ['channelID', 'serverID'],
    },
  },
});
