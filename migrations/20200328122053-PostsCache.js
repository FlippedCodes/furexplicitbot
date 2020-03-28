module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('postsCache', {
    postID: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
    },
    tags: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    artist: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    link: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      postUnique: {
        fields: ['postID', 'tags'],
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('postsCache'),
};
