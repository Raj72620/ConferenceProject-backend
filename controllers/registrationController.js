const Registration = require("../models/Registration");

exports.registerUser = async (req, res) => {
    try {
        const { name, paperId, paperTitle, institution, phone, email, amountPaid, journalName, feePaid, transactionId } = req.body;

        if (!name || !paperId || !paperTitle || !institution || !phone || !email || !amountPaid || !feePaid || !transactionId) {
            return res.status(400).json({ error: "❌ All required fields must be filled" });
        }

        const newRegistration = new Registration(req.body);
        await newRegistration.save();

        res.status(201).json({ message: "✅ Registration Successful!" });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
