/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('postcache', {
  postID: {
    type: Sequelize.INTEGER(10),
    primaryKey: true,
  },
  tags: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  artist: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  link: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
},
{
  uniqueKeys: {
    postUnique: {
      fields: ['postID', 'tags'],
    },
  },
});
