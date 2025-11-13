// ============================================
// INITIALIZE DEFAULT ADMIN USER
// Run this once to create the first admin
// ============================================

const { pool } = require('./src/config/database');
const { hashPassword } = require('./src/utils/passwordHash');

const createDefaultAdmin = async () => {
    try {
        console.log('Creating default admin user...');
        
        // Hash password
        const hashedPassword = await hashPassword('Admin@123');
        
        // Insert admin (SQLite compatible)
        await pool.query(
            `INSERT OR REPLACE INTO admins (username, email, password_hash, full_name, role)
             VALUES (?, ?, ?, ?, ?)`,
            ['admin', 'admin@mahapola.lk', hashedPassword, 'System Administrator', 'super_admin']
        );
        
        console.log('✅ Default admin created successfully!');
        console.log('   Username: admin');
        console.log('   Password: Admin@123');
        console.log('   PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createDefaultAdmin();