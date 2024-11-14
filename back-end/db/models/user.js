'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // User.hasMany(models.Address, { foreignKey: 'userId' });
            // User.hasMany(models.Order, { foreignKey: 'userId' });
            // User.belongsToMany(models.Product, { through: 'Wishlist', foreignKey: 'userId', otherKey: 'productId' });
            // User.hasMany(models.Wishlist, { foreignKey: 'userId' });
            User.hasMany(models.Exam, { foreignKey: 'createdBy' });
        }
    }
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        role: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
