'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Conferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      websiteId: {
        type: Sequelize.INTEGER,
        references: { model: 'Websites', key: 'id' }
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      deadline: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      comment: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      urlDestination: {
        allowNull: false,
        type: Sequelize.STRING(100)
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
    await queryInterface.dropTable('Conferences');
  }
};
