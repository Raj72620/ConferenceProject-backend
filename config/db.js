// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("✅ MongoDB Connected Successfully!");
//     } catch (err) {
//         console.error("❌ MongoDB Connection Error:", err);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

// Choose the correct URI based on environment
const MONGO_URI = process.env.NODE_ENV === "production"
    ? process.env.MONGO_ATLAS_URI
    : process.env.MONGO_LOCAL_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in .env file");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected Successfully to ${MONGO_URI.includes("localhost") ? "Local" : "Atlas"}`);
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
