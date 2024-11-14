'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [{
            "title": "VSTEP B1 1/2024",
            "description": "Description for VSTEP B1 1/2024 ",
            "createdBy":2,
        },{

            "title": "VSTEP B1 1/2024",
            "description": "Description for VSTEP B1 2/2024 ",
            "createdBy":2,
        }];
        items.forEach(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('Exams', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Exams', null, {});
    }
};
