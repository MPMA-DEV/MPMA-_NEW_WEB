const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      process.env.COURSE,
      {
        headers: {
          "x-api-key": process.env.X_API_KEY,
          "Content-Type": process.env.CONTENT_TYPE,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Fetch courses error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
    });
  }
});

// POST enrollments
router.post("/save", async (req, res) => {
  try {
    const response = await axios.post(
      process.env.REGISTER,
      req.body,
      {
       headers: {
          "x-api-key": process.env.X_API_KEY,
          "Content-Type": process.env.CONTENT_TYPE,
        },
      }
    );

    res.json(response.data);
    console.log("Enrollment saved:", req.body);

  } catch (err) {
    console.error("Save enrollment error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to save enrollment",
    });
  }
});

// Verify Certificate
router.get("/verify", async (req, res) => {
  const { id } = req.query;
  const apiKey = process.env.X_API_KEY;
  const verifyUrl = process.env.VERIFY;

  console.log(`\n🔍 [PORTAL PROXY] New Verification Request:`);
  console.log(`   - ID: ${id}`);
  console.log(`   - Target URL: ${verifyUrl}?id=${id}`);
  console.log(`   - API Key Present: ${apiKey ? 'YES' : 'NO'}`);

  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }

  try {
    const response = await axios.get(
      `${verifyUrl}?id=${id}`,
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": process.env.CONTENT_TYPE || "application/json",
        },
        timeout: 5000 // 5 second timeout
      }
    );

    console.log(`   ✅ [PORTAL PROXY] Success from ERP Server`);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const errorData = error.response?.data;
    
    console.error(`   ❌ [PORTAL PROXY] Error from ERP Server:`);
    console.error(`      - Status: ${status}`);
    console.error(`      - Message: ${error.message}`);
    if (errorData) console.error(`      - ERP Response:`, errorData);

    res.status(status).json({
      success: false,
      message: errorData?.message || "Certificate not found or invalid details.",
      error: error.message
    });
  }
});

module.exports = router;
