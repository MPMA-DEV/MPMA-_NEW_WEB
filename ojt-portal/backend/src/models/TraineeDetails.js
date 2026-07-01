import { DataTypes } from "sequelize";
import { sequalize } from "../database/sequlize.js";

export const TraineeDetails = sequalize.define(
  "trainee_details",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Academic Details
    ATT_NO: { type: DataTypes.INTEGER, allowNull: true },
    REG_NO: { type: DataTypes.STRING(25), allowNull: true, unique: true },
    
    // Personal Details
    name: { type: DataTypes.STRING(100), allowNull: true },
    fullName: { type: DataTypes.STRING(255), allowNull: true },
    address: { type: DataTypes.STRING(500), allowNull: true },
    training_type: { type: DataTypes.STRING(100), allowNull: true },
    instituteName: { type: DataTypes.STRING(255), allowNull: true },
    course: { type: DataTypes.STRING(255), allowNull: true },
    training_period: { type: DataTypes.STRING(100), allowNull: true },
    start_date: { type: DataTypes.DATEONLY, allowNull: true },
    Mobile_No: { type: DataTypes.STRING(20), allowNull: true },
    Resident_No: { type: DataTypes.STRING(20), allowNull: true },
    
    // Emergency Contact Details
    ec_name: { type: DataTypes.STRING(100), allowNull: true },
    ec_relationship: { type: DataTypes.STRING(50), allowNull: true },
    ec_telephone: { type: DataTypes.STRING(20), allowNull: true },
    
    // Bank Details
    bank_accname: { type: DataTypes.STRING(100), allowNull: true },
    bank_accno: { type: DataTypes.STRING(50), allowNull: true },
    bank_bno: { type: DataTypes.INTEGER, allowNull: true },
    bank_branch: { type: DataTypes.STRING(100), allowNull: true },
    
    // Documents and Scans (Stored as BLOBs)
    profilePhoto: { type: DataTypes.BLOB("long"), allowNull: true },
    nic_scan: { type: DataTypes.BLOB("long"), allowNull: true },
    police_report: { type: DataTypes.BLOB("long"), allowNull: true },
    university_id: { type: DataTypes.BLOB("long"), allowNull: true },
    institute_letter: { type: DataTypes.BLOB("long"), allowNull: true },
    consent_letter: { type: DataTypes.BLOB("long"), allowNull: true },
    bank_passbook: { type: DataTypes.BLOB("long"), allowNull: true },
  },
  {
    tableName: "trainee_details",
    timestamps: true,
  }
);
