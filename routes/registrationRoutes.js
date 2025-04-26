const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registrationController");

// Enhanced validation middleware
const validateRegistration = (req, res, next) => {
    const requiredFields = [
        'name', 'paperId', 'paperTitle', 'institution',
        'phone', 'email', 'amount', 'fee_category',
        'transaction_id', 'registration_date'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    const invalidTypes = [];

    // Validate field types
    if (typeof req.body.amount !== 'number') invalidTypes.push('amount must be a number');
    if (isNaN(Date.parse(req.body.registration_date))) invalidTypes.push('invalid date format');

    if (missingFields.length > 0 || invalidTypes.length > 0) {
        const errors = [];
        if (missingFields.length) errors.push(`Missing: ${missingFields.join(', ')}`);
        if (invalidTypes.length) errors.push(`Invalid: ${invalidTypes.join(', ')}`);
        
        return res.status(400).json({
            success: false,
            error: errors.join(' | ')
        });
    }

    next();
};

router.post("/", validateRegistration, registerUser);
module.exports = router;