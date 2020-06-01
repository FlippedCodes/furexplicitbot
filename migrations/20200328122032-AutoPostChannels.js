module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('autopostchannels', {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    tags: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    nextEvent: {
      type: Sequelize.DATE,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('autopostchannels'),
};
