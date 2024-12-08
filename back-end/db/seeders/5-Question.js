'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Questions', [
      {
        questionText: 'What is the main idea of the passage?',
        point: 2,
        orderNum: 1,
        passageId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionText: 'What does the speaker mean?',
        point: 2,
        orderNum: 1,
        passageId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionText: 'Choose the correct synonym.',
        point: 1,
        orderNum: 1,
        passageId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionText: 'Fill in the blank with the correct word.',
        point: 1,
        orderNum: 1,
        passageId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionText: 'Write an essay on the given topic.',
        point: 10,
        orderNum: 1,
        passageId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Questions', null, {})
  },
}
