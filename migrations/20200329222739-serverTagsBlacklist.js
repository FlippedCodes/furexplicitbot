module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('servertagsblacklist', {
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
      primaryKey: true,
    },
    tag: {
      type: Sequelize.STRING(3),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('servertagsblacklist'),
};
