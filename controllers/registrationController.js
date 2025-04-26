const Registration = require("../models/Registration");

exports.registerUser = async (req, res) => {
    try {
        // Destructure with proper field names
        const { 
            name, 
            paperId, 
            paperTitle, 
            institution, 
            phone, 
            email, 
            amount, 
            fee_category, 
            transaction_id, 
            registration_date,
            journalName 
        } = req.body;
        if (isNaN(amount)) {
            return res.status(400).json({
              success: false,
              error: "❌ Amount must be a valid number"
            });
          }
        // Validate required fields
        const requiredFields = [
            name, paperId, paperTitle, institution,
            phone, email, amount, fee_category,
            transaction_id, registration_date
        ];
        
        if (requiredFields.some(field => !field)) {
            return res.status(400).json({ 
                success: false,
                error: "❌ All required fields must be filled" 
            });
        }

        // Check for existing registration
        const existingRegistration = await Registration.findOne({
            $or: [
                { transaction_id },
                { email },
                { paperId }
            ]
        });

        if (existingRegistration) {
            let conflict = "";
            if (existingRegistration.transaction_id === transaction_id) conflict = "Transaction ID";
            if (existingRegistration.email === email) conflict = "Email";
            if (existingRegistration.paperId === paperId) conflict = "Paper ID";
            
            return res.status(409).json({
                success: false,
                error: `❌ ${conflict} already registered!`
            });
        }

        // Create new registration
        const newRegistration = new Registration({
            name,
            paperId: paperId.toUpperCase(),
            paperTitle,
            institution,
            phone,
            email: email.toLowerCase(),
            amount,
            fee_category,
            transaction_id,
            registration_date,
            journalName: journalName || undefined
        });

        // Save to database
        await newRegistration.save();

        res.status(201).json({
            success: true,
            message: "✅ Registration Successful!",
            registrationId: newRegistration._id
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const key = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                success: false,
                error: `❌ ${key.replace('_', ' ').toUpperCase()} already exists!`
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || "🛠️ Internal Server Error"
        });
    }
};