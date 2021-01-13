module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('poolcaches', {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('poolcaches'),
};
