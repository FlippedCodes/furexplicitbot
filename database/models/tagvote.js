/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'tagvote',
  {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    tag: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    vote: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      channelTagUnique: {
        fields: ['channelID', 'tag'],
      },
    },
  },
);
