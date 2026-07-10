import mysql from "mysql2/promise";
import "dotenv/config";

export async function initializeDatabase() {
  const dbName = process.env.DB_NAME || "ojt_portal";
  console.log(`📡 Connecting to MySQL server to initialize database...`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME || process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true, // Allow executing multiple SQL queries
    });

    console.log(`🛠️ Creating database and tables...`);

    const sql = `
CREATE DATABASE IF NOT EXISTS \`${dbName}\`;
USE \`${dbName}\`;

CREATE TABLE IF NOT EXISTS \`staff\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`email\` VARCHAR(100) NULL,
  \`username\` VARCHAR(100) NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`firstName\` VARCHAR(100) NULL,
  \`lastName\` VARCHAR(100) NULL,
  \`department\` VARCHAR(100) NULL,
  \`role\` ENUM('superadmin', 'admin', 'supervisor', 'staff') NOT NULL DEFAULT 'staff',
  \`status\` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  \`refresh_token\` VARCHAR(255) NULL,
  \`reset_token\` VARCHAR(255) NULL,
  \`reset_token_expires\` DATETIME NULL,
  \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`staff_email_unique\` (\`email\`),
  UNIQUE KEY \`staff_username_unique\` (\`username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`trainee_user\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nickname\` VARCHAR(100) NULL,
  \`NIC\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NULL,
  \`username\` VARCHAR(100) NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`status\` ENUM('Pending', 'Processing', 'Active', 'Inactive', 'Rejected') NOT NULL DEFAULT 'Pending',
  \`rejection_reason\` TEXT NULL,
  \`refresh_token\` VARCHAR(255) NULL,
  \`reset_token\` VARCHAR(255) NULL,
  \`reset_token_expires\` DATETIME NULL,
  \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`trainee_user_nic_unique\` (\`NIC\`),
  UNIQUE KEY \`trainee_user_email_unique\` (\`email\`),
  UNIQUE KEY \`trainee_user_username_unique\` (\`username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`trainee_details\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`ATT_NO\` INT NULL,
  \`REG_NO\` VARCHAR(25) NULL,
  \`name\` VARCHAR(100) NULL,
  \`fullName\` VARCHAR(255) NULL,
  \`address\` VARCHAR(500) NULL,
  \`training_type\` VARCHAR(100) NULL,
  \`instituteName\` VARCHAR(255) NULL,
  \`course\` VARCHAR(255) NULL,
  \`training_period\` VARCHAR(100) NULL,
  \`start_date\` DATE NULL,
  \`Mobile_No\` VARCHAR(20) NULL,
  \`Resident_No\` VARCHAR(20) NULL,
  \`ec_name\` VARCHAR(100) NULL,
  \`ec_relationship\` VARCHAR(50) NULL,
  \`ec_telephone\` VARCHAR(20) NULL,
  \`bank_accname\` VARCHAR(100) NULL,
  \`bank_accno\` VARCHAR(50) NULL,
  \`bank_bno\` INT NULL,
  \`bank_branch\` VARCHAR(100) NULL,
  \`profilePhoto\` LONGBLOB NULL,
  \`nic_scan\` LONGBLOB NULL,
  \`police_report\` LONGBLOB NULL,
  \`university_id\` LONGBLOB NULL,
  \`institute_letter\` LONGBLOB NULL,
  \`consent_letter\` LONGBLOB NULL,
  \`bank_passbook\` LONGBLOB NULL,
  \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`trainee_details_reg_no_unique\` (\`REG_NO\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`trainee_user\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(sql);
    console.log("🎉 Database and tables initialized successfully using SQL schema.");
    await connection.end();
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
    throw error;
  }
}
