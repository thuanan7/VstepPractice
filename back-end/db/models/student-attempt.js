'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class StudentAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentAttempt.belongsTo(models.User, { foreignKey: 'userId' })
      StudentAttempt.belongsTo(models.Exam, { foreignKey: 'examId' })
    }
  }

  StudentAttempt.init(
    {
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'StudentAttempt',
    },
  )
  return StudentAttempt
}