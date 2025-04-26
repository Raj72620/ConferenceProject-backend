require("dotenv").config();
const express = require("express");
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
const session = require("express-session");
const flash = require("connect-flash");
const Paper = require("./models/Paper"); // Added Paper model

const app = express();

// ==================== Database Connection ====================
connectDB();

// ==================== Middleware Configuration ====================
app.use(helmet());
app.use(morgan("dev"));

app.use(cors({
  origin: [
    "https://conferenceproject-frontend.onrender.com",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// ==================== Routes ====================
app.use("/api/register", registrationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/submit", paperRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Conference Backend API is running",
    timestamp: new Date().toISOString()
  });
});

// ==================== Cloudinary Configuration ====================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "research_papers",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// Paper submission route
app.post("/submit/papersubmit", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: "No file uploaded" 
      });
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

// ==================== Error Handling ====================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// Improved error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// ==================== Server Startup ====================
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV === "development") {
    console.log(`➡️  Local: http://localhost:${PORT}`);
  }
});