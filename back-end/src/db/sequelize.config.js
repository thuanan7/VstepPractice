import env from '../../env.json' assert { type: "json" };

export default {
    username: env.DB_USERNAME,
    password: env.DB_PWD,
    database: env.DB_NAME,
    host:env.DB_SERVER,
    dialect: env.DB_DRIVER,
}
