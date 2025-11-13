// ============================================
// PASSWORD HASHING UTILITY
// Handles password encryption and verification
// ============================================

const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password) => {
    try {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Password hashing error:', error);
        throw new Error('Password hashing failed');
    }
};

// Compare password with hash
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Password comparison error:', error);
        throw new Error('Password verification failed');
    }
};

// Generate random password
const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
};

module.exports = {
    hashPassword,
    comparePassword,
    generateRandomPassword
};