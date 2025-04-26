const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registrationController");

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const requiredFields = [
        'name', 'paperId', 'paperTitle', 'institution',
        'phone', 'email', 'amount', 'fee_category',
        'transaction_id', 'registration_date'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            error: `Missing required fields: ${missingFields.join(', ')}`
        });
    }
    
    next();
};

// Registration route - Corrected endpoint
router.post("/", registerUser);
module.exports = router;