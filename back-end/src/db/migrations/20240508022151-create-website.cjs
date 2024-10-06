'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Websites', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            url: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(50)
            },
            type: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            timeCrawl: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Websites');
    }
};
