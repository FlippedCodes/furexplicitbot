import { DataTypes } from 'sequelize';

export function main(sequelize) {
  return sequelize.define(
    'postjob',
    {
      channelID: {
        type: DataTypes.STRING(30),
        primaryKey: true,
      },
      tags: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
      },
    },
  );
}

export default main;
