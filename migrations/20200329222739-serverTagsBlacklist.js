module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('serverTagsBlacklist', {
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    tag: {
      type: Sequelize.STRING(3),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('serverTagsBlacklist'),
};
