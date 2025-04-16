const Registration = require("../models/Registration");

exports.registerUser = async (req, res) => {
    try {
        // Match frontend field names exactly
        const { 
            name, 
            paperId, 
            paperTitle, 
            institution, 
            phone, 
            email, 
            amount,          // Changed from amountPaid
            fee_category,    // Changed from feePaid
            transaction_id,  // Changed from transactionId
            registration_date // Added missing field
        } = req.body;

        // Add registration_date to validation
        if (!name || !paperId || !paperTitle || !institution || !phone || 
            !email || !amount || !fee_category || !transaction_id || !registration_date) {
            return res.status(400).json({ error: "❌ All required fields must be filled" });
        }

        const newRegistration = new Registration({
            name,
            paperId,
            paperTitle,
            institution,
            phone,
            email,
            amount,          // Match model
            fee_category,    // Match model
            transaction_id,  // Match model
            registration_date
        });

        await newRegistration.save();
        res.status(201).json({ message: "✅ Registration Successful!" });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};