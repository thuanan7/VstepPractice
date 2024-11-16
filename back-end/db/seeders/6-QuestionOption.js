'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('QuestionOptions', [
      {
        content: "The speaker's intention",
        isCorrect: true,
        orderNum: 1,
        questionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'A specific detail in the passage',
        isCorrect: false,
        orderNum: 2,
        questionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'To clarify the concept',
        isCorrect: true,
        orderNum: 1,
        questionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Confusing the listener',
        isCorrect: false,
        orderNum: 2,
        questionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Choose synonym for "happy"',
        isCorrect: true,
        orderNum: 1,
        questionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
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
