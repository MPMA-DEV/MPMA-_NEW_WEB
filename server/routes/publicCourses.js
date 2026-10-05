const express = require("express");
const axios = require("axios");
const db = require("../db");
const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  const headers = {
    "x-api-key": process.env.X_API_KEY,
    "Content-Type": process.env.CONTENT_TYPE || "application/json",
  };

  const mapLocalCourseRow = (row) => ({
    id: row.id,
    course: row.courseName,
    courseId: row.courseId,
    stream: row.stream,
    medium: row.medium,
    location: row.location,
    assessmentCriteria: row.assessmentCriteria,
    resources: row.resources,
    fees: row.fees,
    registrationFee: row.registrationFee,
    installment1: row.installment1,
    installment2: row.installment2,
    additionalInstallments: row.additionalInstallments,
    description: row.description,
    duration: row.duration,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    no_of_participants: row.no_of_participants,
  });

  try {
    const response = await axios.get(
      process.env.COURSE,
      {
        headers,
        timeout: 5000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Fetch courses error from ERP endpoint:", error.message);

    try {
      const [rows] = await db.query(
        `
          SELECT
            id,
            courseId,
            stream,
            courseName,
            medium,
            location,
            assessmentCriteria,
            resources,
            fees,
            registrationFee,
            installment1,
            installment2,
            additionalInstallments,
            description,
            duration,
            status,
            created_at,
            updated_at,
            no_of_participants
          FROM courses
          WHERE status = 'Active'
          ORDER BY created_at DESC
        `
      );

      const fallbackCourses = rows.map(mapLocalCourseRow);
      console.warn(
        `Serving ${fallbackCourses.length} courses from local DB fallback because ERP endpoint is unavailable.`
      );

      return res.json({
        success: true,
        source: "local-db-fallback",
        data: fallbackCourses,
      });
    } catch (dbError) {
      console.error("Local DB fallback for courses failed:", dbError.message);
      return res.status(503).json({
        success: false,
        message: "Failed to fetch courses from both ERP endpoint and local DB fallback.",
      });
    }
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
          "Content-Type": process.env.CONTENT_TYPE || "application/json",
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
