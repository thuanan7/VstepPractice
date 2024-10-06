import { CreationOptional, DataTypes, Model } from "sequelize";

import connection from "../db/connection";
interface UserAttributes {
  id?: number;
  userName: string;
  passwordHash: string;
  firstName: string;
  lastName?: string;
  isDeleted?: boolean;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public userName!: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public isDeleted!: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    passwordHash: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
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
    modelName: "Users",
  },
);

export default User;
