'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Questions', [
      {
        id: 1,
        questionText: 'What is the main idea of the passage?',
        point: 2,
        orderNum: 1,
        sectionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        questionText: 'What does the speaker mean?',
        point: 2,
        orderNum: 1,
        sectionId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        questionText: 'Choose the correct synonym.',
        point: 1,
        orderNum: 1,
        sectionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        questionText: 'Fill in the blank with the correct word.',
        point: 1,
        orderNum: 1,
        sectionId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        questionText: 'Write an essay on the given topic.',
        point: 10,
        orderNum: 1,
        sectionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Questions', null, {})
  },
}
