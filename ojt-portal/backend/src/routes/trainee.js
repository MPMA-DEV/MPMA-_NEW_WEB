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

import { authenticateToken, requireStatus } from "../middleware/auth.js";
import { uploadLimiter } from "../middleware/security.js";

import { uploadFields } from "../middleware/upload.js";

const router = e.Router();

router.post("/status_update", authenticateToken, requireStatus("Active"), accountStatusUpdate);

router.get("/trainee_details", authenticateToken, requireStatus("Active"), getDetails);

router.get("/trainee_details/:id", authenticateToken, requireStatus("Active", "Processing", "Pending"), getDetailsById);

router.get("/stream/:userId/:docType", authenticateToken, requireStatus("Active", "Processing", "Pending"), streamDocument);

router.get("/stream-photo/:userId", authenticateToken, requireStatus("Active", "Processing", "Pending"), streamProfilePhoto);

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

  addInformation
);

router.get("/active_trainee_by_nic/:nic", authenticateToken, requireStatus("Active", "Processing", "Pending"), getTraineeByNIC);

export default router;
