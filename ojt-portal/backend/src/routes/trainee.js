import e from "express";

import {
  accountStatusUpdate,
  getDetails,
  addInformation,
  getDetailsById,
  streamDocument,
  streamProfilePhoto,
  getTraineeByNIC,
} from "../controllers/traineeControllers.js";

import { authenticateToken, requireStatus, authorizeUserOrStaff } from "../middleware/auth.js";
import { uploadLimiter } from "../middleware/security.js";

import { uploadFields } from "../middleware/upload.js";

const router = e.Router();

router.post("/status_update", authenticateToken, requireStatus("Active"), authorizeUserOrStaff("id", "body", "id"), accountStatusUpdate);

router.get("/trainee_details", authenticateToken, requireStatus("Active"), getDetails);

router.get("/trainee_details/:id", authenticateToken, requireStatus("Active", "Processing", "Pending"), authorizeUserOrStaff("id", "params", "id"), getDetailsById);

router.get("/stream/:userId/:docType", authenticateToken, requireStatus("Active", "Processing", "Pending"), authorizeUserOrStaff("userId", "params", "id"), streamDocument);

router.get("/stream-photo/:userId", authenticateToken, requireStatus("Active", "Processing", "Pending"), authorizeUserOrStaff("userId", "params", "id"), streamProfilePhoto);

router.post(
  "/information",
  authenticateToken,
  requireStatus("Pending"),
  uploadLimiter,
  uploadFields([
    { name: "personalDetails[profilePhoto]", maxCount: 1 },
    { name: "documents[nicScan]", maxCount: 1 },
    { name: "documents[policeReport]", maxCount: 1 },
    { name: "documents[universityId]", maxCount: 1 },
    { name: "documents[instituteLetter]", maxCount: 1 },
    { name: "documents[consentLetter]", maxCount: 1 },
    { name: "documents[bankPassbook]", maxCount: 1 },
  ]),
  authorizeUserOrStaff("user_id", "body", "id"),
  addInformation
);

router.get("/active_trainee_by_nic/:nic", authenticateToken, requireStatus("Active", "Processing", "Pending"), authorizeUserOrStaff("nic", "params", "nic"), getTraineeByNIC);

export default router;
