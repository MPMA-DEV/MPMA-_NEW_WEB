import e from "express";
import { login, refreshToken, logout } from "../controllers/authController.js";
import { loginLimiter, refreshTokenLimiter } from "../middleware/security.js";

const router = e.Router();

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshTokenLimiter, refreshToken);
router.post("/logout", logout);

export default router;
