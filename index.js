require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const connectDB = require("./config/db");
const registrationRoutes = require("./routes/registrationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paperRoutes = require("./routes/paperRoutes");
const Contact = require("./models/Contact");
const Paper = require("./models/Paper");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

// ==================== 🔹 CRITICAL FIXES START HERE ====================

// 🔹 CORS Configuration (Updated)
app.use(cors({
  origin: [
    "https://conferenceproject-frontend.onrender.com",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔹 Route Order Fix (MUST COME FIRST)
app.use("/api/register", registrationRoutes); // Changed to match frontend
app.use("/api/contact", contactRoutes);
app.use("/submit", paperRoutes);

// ==================== 🔹 CRITICAL FIXES END HERE ====================

// 🔹 Security Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔹 Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "strong-secret-key-here",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    maxAge: 60000 
  }
}));
app.use(flash());

// 🔹 Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// 🔹 Database Connection
connectDB();

// 🔹 Static File Serving (Moved after API routes)
app.get("/", (req, res) => {
  res.send("Conference Backend API is running ✅");
});

// 🔹 Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 File Upload Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "research_papers",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// 🔹 Paper Submission Route
app.post("/submit/papersubmit", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const newPaper = new Paper({
      ...req.body,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      fileUrl: req.file.path
    });

    await newPaper.save();

    res.json({
      success: true,
      message: "Paper submitted successfully",
      paperId: newPaper._id,
      fileUrl: req.file.path
    });

  } catch (error) {
    console.error("Paper submission error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Internal server error" 
    });
  }
});

// 🔹 Paper Retrieval Route
app.get("/papers/:id", async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, error: "Paper not found" });
    }
    res.json({ success: true, ...paper._doc });
  } catch (error) {
    console.error("Paper fetch error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Internal server error" 
    });
  }
});

// 🔹 Error Handling Middleware (Critical Addition)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
  });
});

// 🔹 Server Startup
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV === "development") {
    console.log(`➡️  Local: http://localhost:${PORT}`);
  }
});