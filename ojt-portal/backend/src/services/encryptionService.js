import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Get encryption key from environment variable
 * Key must be 32 bytes (64 hex characters) for AES-256
 */
const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY environment variable is not set');
    }
    // Convert hex string to buffer
    const keyBuffer = Buffer.from(key, 'hex');
    if (keyBuffer.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
    }
    return keyBuffer;
};

/**
 * Encrypt plaintext using AES-256-GCM
 * @param {string} plainText - The text to encrypt
 * @returns {string} - Encrypted string in format: iv:authTag:cipherText (all base64)
 */
export const encrypt = (plainText) => {
    if (!plainText) return plainText;

    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
    });

    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:cipherText (all base64 encoded)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
};

/**
 * Decrypt ciphertext using AES-256-GCM
 * @param {string} encryptedText - The encrypted string in format: iv:authTag:cipherText
 * @returns {string} - Decrypted plaintext
 */
export const decrypt = (encryptedText) => {
    if (!encryptedText) return encryptedText;

    // Check if the text is in encrypted format (contains two colons for iv:authTag:cipherText)
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
        // Not encrypted (legacy message), return as-is
        return encryptedText;
    }

    try {
        const key = getEncryptionKey();
        const [ivBase64, authTagBase64, cipherText] = parts;

        const iv = Buffer.from(ivBase64, 'base64');
        const authTag = Buffer.from(authTagBase64, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
            authTagLength: AUTH_TAG_LENGTH
        });
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(cipherText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        // If decryption fails, it might be a legacy unencrypted message
        // Log the error but return the original text
        console.error('Decryption failed, returning original text:', error.message);
        return "_Cannot read this message._";
    }
};

/**
 * Generate a new encryption key (utility function)
 * Run: node -e "import('./encryptionService.js').then(m => console.log(m.generateKey()))"
 * @returns {string} - 32-byte hex string suitable for ENCRYPTION_KEY
 */
export const generateKey = () => {
    return crypto.randomBytes(32).toString('hex');
};
