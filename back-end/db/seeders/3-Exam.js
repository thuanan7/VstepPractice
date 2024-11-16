'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Exams', [
      {
        id: 1,
        title: 'Exam 1',
        description: 'Listening and Reading',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
      },
      {
        id: 2,
        title: 'Exam 2',
        description: 'Writing Test',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
      },
      {
        id: 3,
        title: 'Exam 3',
        description: 'Full VSTEP',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Exams', null, {})
  },
}
