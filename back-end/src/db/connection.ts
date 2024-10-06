import { Sequelize } from 'sequelize';
import {databaseConfigs} from "../app/configs";
const {dbName, dbConfig,dbDriver} = databaseConfigs;
const { userName, password } = dbConfig.authentication.options;
const host = dbConfig.server;
let connection: Sequelize = new Sequelize(dbName, userName, password, { host, dialect: dbDriver });
export default connection;
