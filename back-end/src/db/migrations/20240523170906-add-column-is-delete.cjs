/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn(
                    'Conferences',
                    'isDeleted',
                    {
                        type: Sequelize.DataTypes.BOOLEAN,
                        defaultValue:false
                    },
                    {transaction: t},
                ),
                queryInterface.addColumn(
                    'Users',
                    'isDeleted',
                    {
                        type: Sequelize.DataTypes.BOOLEAN,
                        defaultValue:false
                    },
                    {transaction: t},
                ),
                queryInterface.addColumn(
                    'Websites',
                    'isDeleted',
                    {
                        type: Sequelize.DataTypes.BOOLEAN,
                        defaultValue:false
                    },
                    {transaction: t},
                ),
                queryInterface.addColumn(
                    'WebsiteSchemas',
                    'isDeleted',
                    {
                        type: Sequelize.DataTypes.BOOLEAN,
                        defaultValue:false
                    },
                    {transaction: t},
                ),
            ]);
        });
    },
    async down(queryInterface) {
        await queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Conferences', 'isDeleted', {transaction: t}),
                queryInterface.removeColumn('Websites', 'isDeleted', {transaction: t}),
                queryInterface.removeColumn('Users', 'isDeleted', {transaction: t}),
                queryInterface.removeColumn('WebsiteSchemas', 'isDeleted', {transaction: t}),
            ]);
        });
    },
};
