import e from "express";
import { getAllTrainees, createTrainee, verifyTrainee, updateTrainee, deleteTrainee } from "../controllers/staffController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = e.Router();

// Only allow superadmin or general staff to access these routes.
// We use authenticateToken to ensure the user is logged in, and requireRole to ensure they are staff.
// Note: The Staff model sets user.role in the token. If superadmin is required, we can check for that.
router.get("/trainees", authenticateToken, requireRole("superadmin", "admin", "staff"), getAllTrainees);

router.post("/trainees", authenticateToken, requireRole("superadmin", "admin", "staff"), createTrainee);

router.put("/trainees/:id/verify", authenticateToken, requireRole("superadmin", "admin", "staff"), verifyTrainee);

router.put("/trainees/:id", authenticateToken, requireRole("superadmin", "admin", "staff"), updateTrainee);
router.delete("/trainees/:id", authenticateToken, requireRole("superadmin", "admin", "staff"), deleteTrainee);

export default router;
