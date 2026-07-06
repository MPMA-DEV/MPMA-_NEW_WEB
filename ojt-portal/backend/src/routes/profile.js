import e from "express";
import { uploadSingle, uploadFields } from "../middleware/upload.js";
import { changeProfile, changePassword, uploadProfilePhoto, requestEdit, updateDetails } from "../controllers/profileController.js";
import { authenticateToken, requireStatus, authorizeUserOrStaff } from "../middleware/auth.js";
import { passwordChangeLimiter, uploadLimiter } from "../middleware/security.js";

const router = e.Router();

router.post("/:userId", authenticateToken, requireStatus("Active"), authorizeUserOrStaff("userId", "params", "id"), changeProfile);

router.post("/change_password/:userId", authenticateToken, requireStatus("Active"), passwordChangeLimiter, authorizeUserOrStaff("userId", "params", "id"), changePassword);


router.post("/:userId/photo", authenticateToken, requireStatus("Active"), uploadLimiter, uploadSingle("personalDetails[profilePhoto]"), authorizeUserOrStaff("userId", "params", "id"), uploadProfilePhoto);

// Edit details routes
router.post("/request-edit/:userId", authenticateToken, requireStatus("Active"), authorizeUserOrStaff("userId", "params", "id"), requestEdit);

router.put(
    "/update-details/:userId",
    authenticateToken,
    requireStatus("Active"),
    uploadLimiter,
    uploadFields([
        // { name: "profilePhoto", maxCount: 1 }, // Removed
        { name: "nicScan", maxCount: 1 },
        { name: "policeReport", maxCount: 1 },
        { name: "universityId", maxCount: 1 },
        { name: "instituteLetter", maxCount: 1 },
        { name: "consentLetter", maxCount: 1 },
        { name: "bankPassbook", maxCount: 1 },
    ]),
    authorizeUserOrStaff("userId", "params", "id"),
    updateDetails
);

export default router;
