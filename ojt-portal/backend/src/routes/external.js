import e from "express";

import {
  getDetailsById,
  streamDocument
} from "../controllers/traineeControllers.js";

import { apiKeyAuth } from "../middleware/apiKeyAuth.js";

const router = e.Router();

// Get trainee details using the external API key
router.get("/trainee_details/:id", apiKeyAuth, getDetailsById);

// Stream trainee documents using the external API key
router.get("/stream/:userId/:docType", apiKeyAuth, streamDocument);

export default router;
