import { DataTypes } from 'sequelize';

export function main(sequelize) {
  return sequelize.define(
  'postjob',
  {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    tags: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
  },
);
}

