const {Op} = require('sequelize')
const dataConfigs = require('../../../data.json')
const bcrypt = require('bcryptjs');
const template = {
    main: {
        value: 'table.conference',
        position: 0,
    },
    rows: {
        value: 'tr'
    },
    title: {
        value: 'td.confname>a',
        position: 0,
        type: 'text'
    },
    url: {
        value: 'td.confname>a',
        position: 0,
        type: 'href'
    },
    description: {
        value: 'td.subformat',
        type: 'html'
    },
    deadline: {
        value: 'td.now-deadline,td.deadline',
        type: 'html'
    },
    date: {
        value: 'td.date',
        type: 'text'
    },
    location: {
        value: 'td.location',
        type: 'text'
    }
}
module.exports = {
    up: async queryInterface => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin@123', salt);
        await queryInterface.bulkInsert(
            'Users',
            [
                {
                    userName: 'admin',
                    passwordHash: hashedPassword,
                    firstName: 'admin',
                    lastName: 'admin',
                    createdAt: new Date()
                },
            ],
            {},
        );
        await queryInterface.bulkInsert(
            'Settings',
            [
                {
                    key: dataConfigs.SETTING_KEYS.RUN_JOB,
                    value: 'T',
                    createdAt: new Date()
                },
            ],
            {},
        );
        const websites = await queryInterface.bulkInsert(
            'Websites',
            [
                {
                    url: 'https://ccfddl.github.io/conference/allconf.yml',
                    name: dataConfigs.SPECIAL_WEBSITE_KEY.CCFDDL,
                    timeCrawl: 2,
                    type: dataConfigs.TYPE_WEBSITE.SPECIAL,
                    createdAt: new Date()
                },
                {
                    url: 'https://www.lix.polytechnique.fr/~hermann/conf.php',
                    name: dataConfigs.NORMAL_WEBSITE_KEY.POLYTECHNIQUE,
                    timeCrawl: 2,
                    type: dataConfigs.TYPE_WEBSITE.NORMAL,
                    createdAt: new Date()
                }
            ],
            {returning: true},
        )
        if (websites.length > 0) {
            const Ccfddl = websites.find(x => x.name === dataConfigs.SPECIAL_WEBSITE_KEY.CCFDDL);
            const Polytechnique = websites.find(x => x.name === dataConfigs.NORMAL_WEBSITE_KEY.POLYTECHNIQUE);
            if (Ccfddl) {
                await queryInterface.bulkInsert(
                    'WebsiteSchemas',
                    [
                        {
                            key: dataConfigs.SCHEMA_KEYS.SPECIAL,
                            value: dataConfigs.SPECIAL_WEBSITE_KEY.CCFDDL,
                            websiteId: Ccfddl.id,
                            createdAt: new Date()
                        },
                    ],
                    {},
                )
            }
            if (Polytechnique) {
                await queryInterface.bulkInsert(
                    'WebsiteSchemas',
                    [
                        {
                            key: dataConfigs.SCHEMA_KEYS.MAIN,
                            value: template.main.value,
                            position: template.main.position,
                            type: template.main.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                        {
                            key: dataConfigs.SCHEMA_KEYS.ROWS,
                            value: template.rows.value,
                            position: template.rows.position,
                            type: template.rows.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                        {
                            key: dataConfigs.SCHEMA_KEYS.TITLE,
                            value: template.title.value,
                            position: template.title.position,
                            type: template.title.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                        {
                            key: dataConfigs.SCHEMA_KEYS.URL,
                            value: template.url.value,
                            position: template.url.position,
                            type: template.url.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                        {
                            key: dataConfigs.SCHEMA_KEYS.DESCRIPTION,
                            value: template.description.value,
                            position: template.description.position,
                            type: template.description.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                        {
                            key: dataConfigs.SCHEMA_KEYS.DEADLINE,
                            value: template.deadline.value,
                            position: template.deadline.position,
                            type: template.deadline.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                        {
                            key: dataConfigs.SCHEMA_KEYS.DATE,
                            value: template.date.value,
                            position: template.date.position,
                            type: template.date.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                        {
                            key: dataConfigs.SCHEMA_KEYS.LOCATION,
                            value: template.location.value,
                            position: template.location.position,
                            type: template.location.type,
                            websiteId: Polytechnique.id,
                            createdAt: new Date()
                        },
                    ],
                    {},
                )
            }
        }


    },
    down: async queryInterface => {
        await queryInterface.bulkDelete('Users', {[Op.or]: [{userName: 'admin'}]});
        await queryInterface.bulkDelete('WebsiteSchemas');
        await queryInterface.bulkDelete('Websites');

    },
};
