'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SectionParts', [
      {
        title: 'Listening Section',
        instructions: 'Listen carefully to the audio',
        content: null,
        orderNum: 1,
        examId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Reading Section',
        instructions: 'Read the passage carefully',
        content: null,
        orderNum: 2,
        examId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Writing Section',
        instructions: 'Write your essay',
        content: null,
        orderNum: 1,
        examId: 2,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Grammar Section',
        instructions: 'Fill in the blanks',
        content: null,
        orderNum: 2,
        examId: 2,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Listening Part 1',
        instructions: 'Listen to the conversation',
        content: null,
        orderNum: 1,
        examId: 3,
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Reading Part 1',
        instructions: 'Comprehension Questions',
        content: null,
        orderNum: 2,
        examId: 3,
        parentId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SectionParts', null, {})
  },
}
