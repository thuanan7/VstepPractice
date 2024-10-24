'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [{
            "email": "admin@gmail.com",
            "password": "Demo@123",
            "firstName": "Supper",
            "lastName": "Admin",
            "role": 0
        }, {
            "email": "teacher@gmail.com",
            "password": "Demo@123",
            "firstName": "Enrico",
            "lastName": "De Ferraris",
            "role": 1
        }, {
            "email": "student1@gmail.com",
            "password": "Demo@123",
            "firstName": "Lisle",
            "lastName": "Carlick",
            "role": 1
        }];
        items.forEach(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('Users', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
