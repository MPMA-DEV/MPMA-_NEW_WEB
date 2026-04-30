// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// // GET all public courses
// router.get("/", async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         courseId,
//         courseName,
//         stream,
//         medium,
//         duration,
//         fees,
//         registrationFee,
//         description
//       FROM courses
//       WHERE status = 'Active'
//       ORDER BY courseName
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error("Public courses error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // GET course by ID
// router.get("/:courseId", async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT
//         courseId,
//         courseName,
//         stream,
//         medium,
//         duration,
//         fees,
//         registrationFee,
//         description
//       FROM courses
//       WHERE courseId = ? AND status = 'Active'
//       `,
//       [courseId],
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     res.json(rows[0]);
//   } catch (err) {
//     console.error("Public course error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const axios = require("axios");
const router = express.Router();



// This is used to get courses 
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
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
    });
  }
});

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
    cosole.log(req.body)

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Failed to save enrollment",
    });
  }
});

module.exports = router;


