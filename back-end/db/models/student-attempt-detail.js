'use strict'
const { Model } = require('sequelize')
const { fa } = require('@faker-js/faker')
module.exports = (sequelize, DataTypes) => {
  class StudentAttemptDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentAttemptDetail.belongsTo(models.StudentAttempt, {
        foreignKey: 'studentAttemptId',
      })
    }
  }

  StudentAttemptDetail.init(
    {
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sectionType: DataTypes.INTEGER,
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
    },
    {
      sequelize,
      modelName: 'StudentAttemptDetail',
    },
  )
  return StudentAttemptDetail
}
