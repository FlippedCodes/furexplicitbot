module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('postscache', {
    ID: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    channelID: {
      type: Sequelize.STRING(30),
      allowNull: false,
      references: {
        model: 'autopostchannels',
        key: 'channelID',
      },
    },
    postID: {
      type: Sequelize.INTEGER(10),
      allowNull: false,
    },
    artist: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    directLink: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      autoPostUnique: {
        fields: ['channelID', 'postID'],
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('postscache'),
};
