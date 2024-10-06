'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(t => {
            return Promise.all([queryInterface.addColumn('Websites', 'nextCrawl', {
                allowNull: true, type: Sequelize.DataTypes.BIGINT,
            }, {transaction: t},), queryInterface.addColumn('Websites', 'lastCrawl', {
                allowNull: true, type: Sequelize.DataTypes.BIGINT,
            }, {transaction: t},), queryInterface.addColumn('Conferences', 'location', {
                allowNull: true, type: Sequelize.DataTypes.STRING,
            }, {transaction: t},), queryInterface.addColumn('Conferences', 'timezone', {
                allowNull: true, type: Sequelize.DataTypes.STRING,
            }, {transaction: t},), queryInterface.addColumn('Conferences', 'date', {
                allowNull: true, type: Sequelize.DataTypes.STRING,
            }, {transaction: t},),]);
        });
    }, async down(queryInterface) {
        await queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Websites', 'nextCrawl', {transaction: t}),
                queryInterface.removeColumn('Websites', 'lastCrawl', {transaction: t}),
                queryInterface.removeColumn('Conferences', 'location', {transaction: t}),
                queryInterface.removeColumn('Conferences', 'date', {transaction: t}),
                queryInterface.removeColumn('Conferences', 'timezone', {transaction: t}),]);
        });
    }
};
