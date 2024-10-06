import { CreationOptional, DataTypes, Model } from "sequelize";

import connection from "../db/connection";
import { dataConfigs } from "../app/configs";

export const WebsiteSchemaKey = {
  [`${dataConfigs.special}`]: "special",
  [`${dataConfigs.main}`]: "main",
  [`${dataConfigs.rows}`]: "rows",
  [`${dataConfigs.title}`]: "title",
  [`${dataConfigs.url}`]: "url",
  [`${dataConfigs.description}`]: "description",
  [`${dataConfigs.deadline}`]: "deadline",
  [`${dataConfigs.date}`]: "date",
  [`${dataConfigs.location}`]: "location",
};

export interface IWebsiteSchemaAttributes {
  id?: number;
  websiteId: number;
  key: number;
  value: string;
  position?: number;
  type?: string;
  isDeleted?: boolean;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class WebsiteSchema
  extends Model<IWebsiteSchemaAttributes>
  implements IWebsiteSchemaAttributes
{
  public id!: number;
  public websiteId!: number;
  public key!: number;
  public value!: string;
  public type!: string;
  public isDeleted!: boolean;
  public position!: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

WebsiteSchema.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    websiteId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    key: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    value: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    position: {
      allowNull: true,
      type: DataTypes.NUMBER,
    },
    type: {
      allowNull: true,
      defaultValue: "text",
      type: DataTypes.STRING,
    },
    isDeleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      defaultValue: new Date(),
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: "WebsiteSchemas",
  },
);

export default WebsiteSchema;
