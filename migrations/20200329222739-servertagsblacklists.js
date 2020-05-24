module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('servertagsblacklists', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    tag: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      uniqueBlock: {
        fields: ['serverID', 'tag'],
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('servertagsblacklists'),
};
