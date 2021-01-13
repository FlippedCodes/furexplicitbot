/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('poolcache', {
  messageID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
  poolIndex: {
    type: Sequelize.INTEGER(2),
    allowNull: false,
  },
  postID: {
    type: Sequelize.INTEGER(10),
    allowNull: false,
  },
});
