import multer from "multer";
import path from "path";

// Configure storage in memory instead of disk
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocumentTypes = /pdf|doc|docx|txt/;
  const allowedTypes = new RegExp(
    `${allowedImageTypes.source}|${allowedDocumentTypes.source}`
  );

  // Check file extension
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (JPEG, JPG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX, TXT) are allowed."
      )
    );
  }
};

// Max file size from environment (in MB), default 1.0MB
const MAX_FILE_SIZE_MB = parseFloat(process.env.MAX_FILE_SIZE_MB) || 1.0;

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 10, // Maximum 10 files per request
  },
  fileFilter: fileFilter,
});

// Middleware for single file upload
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "Too many files. Maximum is 10 files.",
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  };
};

// Middleware for multiple file upload
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: `Too many files. Maximum is ${maxCount} files.`,
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  };
};

// Middleware for multiple fields
export const uploadFields = (fields) => {
  return (req, res, next) => {
    upload.fields(fields)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "Too many files uploaded.",
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Parse nested form keys (e.g., personalDetails[name], contactInfo[email])
      const nestedBody = {};
      Object.keys(req.body).forEach((key) => {
        const keyParts = key.split(/[\[\]]/).filter(Boolean); // Split keys like 'personalDetails[name]'
        let current = nestedBody;
        keyParts.forEach((part, index) => {
          if (index === keyParts.length - 1) {
            current[part] = req.body[key];
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        });
      });

      req.parsedBody = nestedBody;

      next();
    });
  };
};

// Helper function to delete file
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};
