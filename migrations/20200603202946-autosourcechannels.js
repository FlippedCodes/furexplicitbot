module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('autosourcechannels', {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      uniqueAutosource: {
        fields: ['serverID', 'channelID'],
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('autosourcechannels'),
};
