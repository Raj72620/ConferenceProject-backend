// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const { submitPaper } = require("../controllers/paperController");

// const router = express.Router();

// // Configure Multer for File Uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Files will be stored in the uploads/ folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
//     }
// });

// const upload = multer({ storage });

// // Define Route
// router.post("/submit/papersubmit", upload.single("file"), submitPaper);

// module.exports = router;
// const express = require("express");
// const multer = require("multer");
// const { storage } = require("../config/cloudinary"); // Import Cloudinary storage
// const { submitPaper } = require("../controllers/paperController");

// const router = express.Router();

// const upload = multer({ storage }); // Use Cloudinary storage

// // Define Route
// router.post("/submit/papersubmit", upload.single("file"), submitPaper);

// module.exports = router;
const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary"); // Import Cloudinary storage
const { submitPaper } = require("../controllers/paperController");

const router = express.Router();

const upload = multer({ storage }); // Use Cloudinary storage

// Define Route
router.post("/papersubmit", upload.single("file"), submitPaper);

module.exports = router;
