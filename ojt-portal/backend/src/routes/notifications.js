import express from "express";

import { TraineeUser } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await TraineeUser.findByPk(req.user.id);
    if (user && user.rejection_reason) {
      return res.status(200).json([{
        id: 1,
        type: "alert",
        message: user.rejection_reason,
        read: false
      }]);
    }
    return res.status(200).json([]);
  } catch (error) {
    return res.status(500).json([]);
  }
});

// POST mark as read
router.post("/:id/read", (req, res) => {
  return res.status(200).json({ success: true });
});

// POST mark all as read
router.post("/read-all", (req, res) => {
  return res.status(200).json({ success: true });
});

// DELETE clear all
router.delete("/clear-all", (req, res) => {
  return res.status(200).json({ success: true });
});

export default router;
