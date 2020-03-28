module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('autoPostChannels', {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      autoPostUnique: {
        fields: ['channelID', 'serverID'],
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('autoPostChannels'),
};
