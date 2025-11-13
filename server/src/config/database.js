// ============================================
// DATABASE CONNECTION CONFIGURATION
// This file handles database connection (MySQL/SQLite)
// ============================================

require('dotenv').config();

let promisePool;

if (process.env.NODE_ENV === 'development' && process.env.USE_SQLITE === 'true') {
    // Use SQLite for development
    const sqlite3 = require('sqlite3').verbose();
    const { open } = require('sqlite');

    // Create SQLite database connection
    promisePool = {
        getConnection: async () => ({
            execute: async (sql, params) => {
                const db = await open({
                    filename: './database/dev.db',
                    driver: sqlite3.Database
                });
                const result = await db.run(sql, params);
                await db.close();
                return result;
            },
            query: async (sql, params) => {
                const db = await open({
                    filename: './database/dev.db',
                    driver: sqlite3.Database
                });
                const result = await db.all(sql, params);
                await db.close();
                return [result];
            }
        }),
        execute: async (sql, params) => {
            const db = await open({
                filename: './database/dev.db',
                driver: sqlite3.Database
            });
            const result = await db.run(sql, params);
            await db.close();
            return result;
        },
        query: async (sql, params) => {
            const db = await open({
                filename: './database/dev.db',
                driver: sqlite3.Database
            });
            const result = await db.all(sql, params);
            await db.close();
            return [result];
        }
    };
} else {
    // Use MySQL for production
    const mysql = require('mysql2');

    // Create connection pool for better performance
    // Pool automatically manages multiple connections
    const pool = mysql.createPool({
        host: process.env.DB_HOST,           // Database server address
        port: process.env.DB_PORT,           // MySQL port (default: 3306)
        user: process.env.DB_USER,           // Database username
        password: process.env.DB_PASSWORD,   // Database password
        database: process.env.DB_NAME,       // Database name
        waitForConnections: true,            // Wait if no connection available
        connectionLimit: 10,                 // Maximum number of connections
        queueLimit: 0,                       // Unlimited queued requests
        enableKeepAlive: true,               // Keep connection alive
        keepAliveInitialDelay: 0
    });

    // Convert pool to use promises instead of callbacks
    // This makes our code cleaner with async/await
    promisePool = pool.promise();
}

// Test database connection
const testConnection = async () => {
    try {
        if (process.env.NODE_ENV === 'development' && process.env.USE_SQLITE === 'true') {
            // For SQLite, just try to create/open the database
            const sqlite3 = require('sqlite3').verbose();
            const { open } = require('sqlite');
            const db = await open({
                filename: './database/dev.db',
                driver: sqlite3.Database
            });
            await db.close();
            console.log('✅ SQLite database connected successfully!');
            return true;
        } else {
            // For MySQL
            const connection = await promisePool.getConnection();
            console.log('✅ Database connected successfully!');
            connection.release(); // Release connection back to pool
            return true;
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Export the promise pool for use in other files
module.exports = {
    pool: promisePool,
    testConnection
};