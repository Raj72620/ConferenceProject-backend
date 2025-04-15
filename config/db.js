const mongoose = require("mongoose");

// Get Atlas URI from environment variable
const MONGO_URI = process.env.MONGO_ATLAS_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_ATLAS_URI is not defined in .env file");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully to Atlas");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
