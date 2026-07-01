import express from "express";
import cors from "cors";

const app = express();

// Add CORS middleware - this will fix your issue
app.use(cors({
  origin: "http://localhost:5173",  // Allow your frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Add a test login endpoint
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });
  
  // Simple test response
  res.json({
    success: true,
    message: "Login successful",
    token: "test-token-123"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});