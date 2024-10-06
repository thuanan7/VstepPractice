import { CreationOptional, DataTypes, Model } from "sequelize";

import connection from "../db/connection";

export interface IConferenceModel {
  id: number;
  title: string;
  description: string;
  date: string;
  notificationDate: string;
  deadline: string;
  createdDate: string;
  comment: string;
  location: string;
  timezone: string;
  website: string;
}

export interface IConferenceDeadlineModel {
  deadline: string;
  comment: string;
}

export interface ConferenceAttributes {
  id?: number;
  websiteId: number;
  title: string;
  description: string;
  urlDestination: string;
  date: string;
  location: string;
  timezone: string;
  isDeleted?: boolean;
  deadline?: string;
  comment?: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Conference
  extends Model<ConferenceAttributes>
  implements ConferenceAttributes
{
  public id!: number;
  public websiteId!: number;
  public title!: string;
  public description!: string;
  public urlDestination!: string;
  public date!: string;
  public timezone!: string;
  public location!: string;
  public deadline!: string;
  public comment!: string;
  public isDeleted!: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Conference.init(
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
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    deadline: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    comment: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    timezone: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    location: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    date: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    urlDestination: {
      allowNull: false,
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
    modelName: "Conferences",
    indexes: [
      {
        unique: true,
        fields: ["id", "urlDestination"],
      },
    ],
  },
);

export default Conference;
