import { DataTypes } from 'sequelize';

export function main(sequelize) {
  return sequelize.define(
    'postcache',
    {
      ID: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      channelID: {
        type: DataTypes.STRING(30),
        allowNull: false,
      // references: {
      //   model: 'autopostchannels',
      //   key: 'channelID',
      // },
      },
      postID: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
      },
      artist: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
      },
      directLink: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
      },
    },
    {
      uniqueKeys: {
        autoPostUnique: {
          fields: ['channelID', 'postID'],
        },
      },
    },
  );
}

export default main;
