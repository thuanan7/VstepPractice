import { CreationOptional, DataTypes, Model } from "sequelize";

import connection from "../db/connection";
import Conference from "./conference.model";
import WebsiteSchema from "./website-schema.model";

export enum TypeWebsite {
  Special = 0,
  Normal = 1,
}

interface WebsiteAttributes {
  id?: number;
  name: string;
  url: string;
  type: number;
  timeCrawl: number;
  nextCrawl?: number;
  lastCrawl?: number;
  isDeleted?: boolean;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Website extends Model<WebsiteAttributes> implements WebsiteAttributes {
  public id!: number;
  public name!: string;
  public url!: string;
  public timeCrawl!: number;
  public type!: number;
  public nextCrawl!: number;
  public lastCrawl!: number;
  public isDeleted!: boolean;
  public WebsiteSchemas!: WebsiteSchema[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Website.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isDeleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    timeCrawl: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    nextCrawl: {
      allowNull: true,
      type: DataTypes.NUMBER,
    },
    lastCrawl: {
      allowNull: true,
      type: DataTypes.NUMBER,
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
    modelName: "Website",
  },
);
Website.hasMany(Conference);
Website.hasMany(WebsiteSchema);
export default Website;
