const Contact = require("../models/Contact");

exports.submitContact = async (req, res) => {
    const { name, email, phone, message } = req.body;

    // 1. Improved Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return res.status(400).json({ 
            success: false,
            error: "Name, email and message are required fields" 
        });
    }

    try {
        // 2. Phone Number Formatting (optional)
        const formattedPhone = phone ? phone.replace(/[^\d]/g, "") : null;

        // 3. Save to Database
        const newContact = new Contact({ 
            name: name.trim(),
            email: email.trim(),
            phone: formattedPhone, // or just phone.trim()
            message: message.trim()
        });

        await newContact.save();

        // 4. Better Success Response
        res.status(201).json({
            success: true,
            message: "Contact submitted successfully",
            referenceId: newContact._id // Send back MongoDB ID
        });

    } catch (error) {
        // 5. Enhanced Error Handling
        console.error("Contact Submission Error:", error);
        
        const errorMessage = error.name === 'ValidationError' 
            ? "Invalid data format: " + error.message
            : "Failed to submit contact form";

        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};