module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('poolcaches', {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    messageID: {
      type: Sequelize.STRING(30),
      allowNull: false,
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
