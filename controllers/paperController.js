// const Paper = require("../models/Paper");

// // Handle Paper Submission
// exports.submitPaper = async (req, res) => {
//     try {
//         const { name, institution, title, email, phone, research_area, journal, country } = req.body;
//         const filePath = req.file ? req.file.path : null;

//         if (!filePath) {
//             return res.status(400).json({ error: "File upload failed" });
//         }

//         const newPaper = new Paper({
//             name,
//             institution,
//             title,
//             email,
//             phone,
//             research_area,
//             journal,
//             country,
//             filePath
//         });

//         await newPaper.save();
//         res.status(201).json({ message: "Paper submitted successfully!", paper: newPaper });
//     } catch (error) {
//         console.error("Error submitting paper:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
// const Paper = require("../models/Paper");

// exports.submitPaper = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "No file uploaded!" });
//         }

//         const newPaper = new Paper({
//             name: req.body.name,
//             institution: req.body.institution,
//             title: req.body.title,
//             email: req.body.email,
//             phone: req.body.phone,
//             research_area: req.body.research_area,
//             journal: req.body.journal,
//             country: req.body.country,
//             fileUrl: req.file.path, // Cloudinary URL
//             fileId: req.file.filename // Cloudinary File ID
//         });

//         await newPaper.save();

//         res.json({
//             success: true,
//             message: "Paper submitted successfully!",
//             paperId: newPaper._id
//         });

//     } catch (error) {
//         console.error("❌ Error Handling Submission:", error.message);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };
const Paper = require("../models/Paper");

exports.submitPaper = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded!" });
        }

        const newPaper = new Paper({
            name: req.body.name,
            institution: req.body.institution,
            title: req.body.title,
            email: req.body.email,
            phone: req.body.phone,
            research_area: req.body.research_area,
            journal: req.body.journal,
            country: req.body.country,
            fileUrl: req.file.path, // Cloudinary URL
            fileId: req.file.filename // Cloudinary File ID
        });

        await newPaper.save();

        res.json({
            success: true,
            message: "Paper submitted successfully!",
            paperId: newPaper._id
        });

    } catch (error) {
        console.error("❌ Error Handling Submission:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
