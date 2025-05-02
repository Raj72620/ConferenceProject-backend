module.exports = (req, res, next) => {
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
    
    if (!/^[6-9]\d{9}$/.test(req.body.phone)) {
        return res.status(400).json({
            success: false,
            error: "Invalid Indian phone number format"
        });
    }
    
    next();
};