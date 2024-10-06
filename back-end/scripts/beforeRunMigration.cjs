'use strict';
const env = require("../env.json");
const {Connection, Request} = require("tedious");

(async () => {
    try {
        return new Promise((resolve, reject) => {
            console.log('== start check db exist')
            const connection = new Connection({
                server: env.DB_SERVER,
                options: {
                    port: env.DB_PORT,
                    trustServerCertificate: true
                },
                authentication: {
                    type: 'default',
                    options: {
                        userName: env.DB_USERNAME,
                        password: env.DB_PWD
                    }
                }
            });
            connection.connect((err) => {
                const createDbQuery = `IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${env.DB_NAME}') CREATE DATABASE [${env.DB_NAME}];`;
                const request = new Request(createDbQuery, (err) => {
                    if (err) {
                        console.error(err);
                        reject(`Create DB Query Failed: ${err.message}`);
                    }
                    resolve();
                });
                connection.execSql(request);
            })

        })
    } catch (e) {
    }
})().finally(()=>{
    console.log('== finish check db exist')
    process.exit()
});
