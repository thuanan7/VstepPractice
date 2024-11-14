'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Exam extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Exam.belongsTo(models.User, {foreignKey: 'createdBy'});
        }
    }

    Exam.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Exam',
    });
    return Exam;
};
