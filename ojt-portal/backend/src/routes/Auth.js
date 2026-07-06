import e from "express";
import { login, refreshToken, logout, getMe } from "../controllers/authController.js";
import { loginLimiter, refreshTokenLimiter } from "../middleware/security.js";
import { authenticateToken } from "../middleware/auth.js";

const router = e.Router();

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshTokenLimiter, refreshToken);
router.post("/logout", logout);
router.get("/me", authenticateToken, getMe);

export default router;
