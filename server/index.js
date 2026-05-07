require('dotenv').config();
const process = require('process');

const express = require("express");
const cors = require("cors");

const publicCourses = require("./routes/publicCourses");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/courses", publicCourses);


const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Main API running on port ${PORT}`);
});

// Error handling for the server
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use.`);
  } else {
    console.error(`❌ Server error:`, error.message);
  }
  process.exit(1);
});

// Debugging process exit
process.on('exit', (code) => {
  console.log(`ℹ️ Process exited with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

