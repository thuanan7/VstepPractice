'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('QuestionOptions', [
      {
        id: 1,
        content: "The speaker's intention",
        isCorrect: true,
        orderNum: 1,
        questionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        content: 'A specific detail in the passage',
        isCorrect: false,
        orderNum: 2,
        questionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        content: 'To clarify the concept',
        isCorrect: true,
        orderNum: 1,
        questionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        content: 'Confusing the listener',
        isCorrect: false,
        orderNum: 2,
        questionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        content: 'Choose synonym for "happy"',
        isCorrect: true,
        orderNum: 1,
        questionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        content: 'Choose antonym for "sad"',
        isCorrect: false,
        orderNum: 2,
        questionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('QuestionOptions', null, {})
  },
}
