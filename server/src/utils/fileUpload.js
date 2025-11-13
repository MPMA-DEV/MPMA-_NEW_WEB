// ============================================
// FILE UPLOAD UTILITY
// Handles file uploads with validation
// ============================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create upload directories if they don't exist
const createUploadDirs = () => {
    const dirs = [
        'uploads/courses',
        'uploads/news',
        'uploads/documents',
        'uploads/profiles'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine destination based on file field
        let uploadPath = 'uploads/';
        
        if (file.fieldname === 'course_image') {
            uploadPath += 'courses/';
        } else if (file.fieldname === 'featured_image') {
            uploadPath += 'news/';
        } else {
            uploadPath += 'documents/';
        }
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueId = uuidv4();
        const fileExt = path.extname(file.originalname);
        const fileName = `${uniqueId}${fileExt}`;
        cb(null, fileName);
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG and WebP are allowed.'), false);
    }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG are allowed.'), false);
    }
};

// Image upload configuration
const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: imageFilter
});

// Document upload configuration
const uploadDocument = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: documentFilter
});

// Delete file function
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

module.exports = {
    createUploadDirs,
    uploadImage,
    uploadDocument,
    deleteFile
};