// const mongoose = require("mongoose");

// const PaperSchema = new mongoose.Schema({
//     name: String,
//     institution: String,
//     title: String,
//     email: String,
//     phone: String,
//     research_area: String,
//     journal: String,
//     country: String,
//     filename: String,
//     mimetype: String,
//     size: Number,
//     fileBase64: String // Storing the file as Base64
// });

// const Paper = mongoose.model("Paper", PaperSchema);

// module.exports = Paper;
// const mongoose = require("mongoose");

// const PaperSchema = new mongoose.Schema({
//     name: String,
//     institution: String,
//     title: String,
//     email: String,
//     phone: String,
//     research_area: String,
//     journal: String,
//     country: String,
//     fileUrl: String, // Cloudinary File URL
//     fileId: String   // Cloudinary File ID
// });

// const Paper = mongoose.model("Paper", PaperSchema);

// module.exports = Paper;
const mongoose = require("mongoose");

const PaperSchema = new mongoose.Schema({
    name: String,
    institution: String,
    title: String,
    email: String,
    phone: String,
    research_area: String,
    journal: String,
    country: String,
    fileUrl: String, // Cloudinary File URL
    fileId: String   // Cloudinary File ID
});

const Paper = mongoose.model("Paper", PaperSchema);

module.exports = Paper;

