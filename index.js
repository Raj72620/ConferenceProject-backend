
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

// 🔹 Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: "anupriya", // Change this to a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }, // Flash message will last for 60 seconds
    })
);
app.use(flash());

// 🔹 Pass Flash Messages to Views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// 🔹 Connect to MongoDB
connectDB();

// 🔹 Serve Static Files
app.get("/", (req, res) => {
    res.send("Conference Backend API is running ✅");
  });
  
app.use("/api/registrations", registrationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/submit", paperRoutes);

// 🔹 Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "research_papers", // Cloudinary folder
        resource_type: "auto",
    },
});

const upload = multer({ storage });

// 🔹 Contact Form Submission
app.post("/api/contact/contacts", async (req, res) => {
    const { user_name, user_email, user_phone, user_message } = req.body;

    try {
        const newContact = new Contact({
            name: user_name,
            email: user_email,
            phone: user_phone,
            message: user_message
        });

        await newContact.save();
        res.status(200).send("Form submitted and data saved successfully!");

    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("An error occurred while saving the data.");
    }
});

// 🔹 Paper Submission (Uploads to Cloudinary)
app.post("/submit/papersubmit", upload.single("file"), async (req, res) => {
    try {
        console.log("📩 Form Data Received:", req.body);
        console.log("📄 Uploaded File:", req.file);

        if (!req.file) {
            throw new Error("No file uploaded!");
        }

        // Store in MongoDB with Cloudinary URL
        const newPaper = new Paper({
            name: req.body.name,
            institution: req.body.institution,
            title: req.body.title,
            email: req.body.email,
            phone: req.body.phone,
            research_area: req.body.research_area,
            journal: req.body.journal,
            country: req.body.country,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            fileUrl: req.file.path, // Cloudinary URL
        });

        await newPaper.save();

        res.json({
            success: true,
            message: "Paper submitted successfully!",
            paperId: newPaper._id,
            fileUrl: req.file.path, // Cloudinary URL
        });

    } catch (error) {
        console.error("❌ Error Handling Submission:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔹 Retrieve Paper (Returns Cloudinary URL)
app.get("/papers/:id", async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);

        if (!paper) {
            return res.status(404).json({ success: false, message: "Paper not found" });
        }

        res.json({
            success: true,
            filename: paper.filename,
            mimetype: paper.mimetype,
            size: paper.size,
            fileUrl: paper.fileUrl, // Cloudinary URL
        });

    } catch (error) {
        console.error("❌ Error Fetching Paper:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔹 Start Server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
