import { DataTypes } from "sequelize";
import { sequalize } from "../database/sequlize.js";
import bcrypt from "bcryptjs";

export const TraineeUser = sequalize.define(
  "trainee_user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    NIC: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "trainee_user_nic_unique",
      validate: {
        notEmpty: true,
        len: [9, 12], // NIC should be 9-12 characters
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "trainee_user_email_unique",
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "trainee_user_username_unique",
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255],
      },
    },
    status: {
      type: DataTypes.ENUM("Pending", "Processing", "Active", "Inactive", "Rejected"),
      defaultValue: "Pending",
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "trainee_user",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Instance method to check password
TraineeUser.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
