import e from "express";
import { forgotPassword, resetPassword, validateResetToken } from "../controllers/passwordResetController.js";
import { loginLimiter } from "../middleware/security.js";

const router = e.Router();

// Rate limit password reset requests to prevent abuse
router.post("/forgot-password", loginLimiter, forgotPassword);

// Reset password with token
router.post("/reset-password", resetPassword);

// Validate token (for frontend to check before showing form)
router.get("/validate-token", validateResetToken);

export default router;
