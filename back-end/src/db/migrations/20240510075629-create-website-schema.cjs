'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('WebsiteSchemas', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            websiteId: {
                type: Sequelize.INTEGER,
                references: {model: 'Websites', key: 'id'}
            },
            key: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            value: {
                allowNull: false,
                type: Sequelize.STRING(50)
            },

            position: {
                allowNull: true,
                defaultValue:0,
                type: Sequelize.INTEGER
            },
            type: {
                allowNull: true,
                defaultValue:'text',
                type: Sequelize.STRING(5)
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
        await queryInterface.dropTable('WebsiteSchemas');
    }
};
