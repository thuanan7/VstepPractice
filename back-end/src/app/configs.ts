import {Dialect} from 'sequelize';
import * as env from '../../env.json';
import * as configsData from '../../data.json';

const dbName = env.DB_NAME as string
const dbUser = env.DB_USERNAME || 'sa'
const dbHost = env.DB_SERVER || 'localhost'
const dbDriver = env.DB_DRIVER as Dialect
const dbPassword = env.DB_PWD || '123456'
const dbPort = env.DB_PORT ? parseInt(`${env.DB_PORT}`) : 1433;
const appConfigs = {
    PORT: env.SERVER_PORT || 3000,
    JWT_SECRET: env.JWT_SECRET || 'NODEJS',
    AUTO_START_JOB: env.AUTO_START_JOB || false,
    JOB_LOOP: env.JOB_LOOP || '* /2 * * * *'
}
const databaseConfigs = {
    dbDriver,
    dbName: dbName,
    dbConfig: {
        server: dbHost,
        options: {
            port: dbPort,
            trustServerCertificate: true
        },
        authentication: {
            type: "default",
            options: {
                userName: dbUser,
                password: dbPassword
            }
        }
    }
}

const dataConfigs = {
    special: configsData.SCHEMA_KEYS.SPECIAL,
    main: configsData.SCHEMA_KEYS.MAIN,
    rows: configsData.SCHEMA_KEYS.ROWS,
    title: configsData.SCHEMA_KEYS.TITLE,
    url: configsData.SCHEMA_KEYS.URL,
    description: configsData.SCHEMA_KEYS.DESCRIPTION,
    deadline: configsData.SCHEMA_KEYS.DEADLINE,
    date: configsData.SCHEMA_KEYS.DATE,
    location: configsData.SCHEMA_KEYS.LOCATION,
}

const dataSpecialWebsite = {
    ccfddl: configsData.SPECIAL_WEBSITE_KEY.CCFDDL
}

const settingKeys = {
    runJob: configsData.SETTING_KEYS.RUN_JOB
}

export {appConfigs, databaseConfigs, dataConfigs, dataSpecialWebsite, settingKeys}
