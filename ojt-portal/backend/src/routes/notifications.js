import express from "express";

const router = express.Router();

// GET all notifications
router.get("/", (req, res) => {
  return res.status(200).json([]);
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
