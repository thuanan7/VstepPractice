import { CreationOptional, DataTypes, Model } from "sequelize";

import connection from "../db/connection";
import Conference from "./conference.model";
import WebsiteSchema from "./website-schema.model";

interface SettingAttributes {
    id?: number;
    key: string;
    value: string;
    updatedAt?: Date;
    createdAt?: Date;
}

class Setting extends Model<SettingAttributes> implements SettingAttributes {
    public id!: number;
    public key!: string;
    public value!: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Setting.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.NUMBER,
        },
        key: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        value: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize: connection,
        modelName: "Settings",
    },
);
export default Setting;
