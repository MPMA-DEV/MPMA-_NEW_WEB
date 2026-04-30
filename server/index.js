require('dotenv').config();
const express = require("express");
const cors = require("cors");

const publicCourses = require("./routes/publicCourses");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/courses", publicCourses);


const PORT = 5000 ;
app.listen(PORT, () => {
  console.log(`✅ Main API running on port ${PORT}`);
});
