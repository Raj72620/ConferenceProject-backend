const Contact = require("../models/Contact");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.submitContact = async (req, res) => {
    const { name, email, phone, message } = req.body;

    // 1. Validate required fields
    if (!name?.trim()) {
        return res.status(400).json({ 
            success: false,
            error: "Name is required" 
        });
    }

    if (!email?.trim()) {
        return res.status(400).json({ 
            success: false,
            error: "Email is required" 
        });
    }

    if (!message?.trim()) {
        return res.status(400).json({ 
            success: false,
            error: "Message is required" 
        });
    }

    // 2. Validate email format
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: "Please enter a valid email address"
        });
    }

    try {
        // 3. Format phone number if provided
        const formattedPhone = phone ? phone.replace(/[^\d]/g, "") : null;

        // 4. Create and save contact
        const newContact = new Contact({ 
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: formattedPhone,
            message: message.trim()
        });

        await newContact.save();

        // 5. Send success response
        res.status(201).json({
            success: true,
            message: "Thank you for your message! We'll get back to you soon.",
            referenceId: newContact._id,
            timestamp: newContact.date
        });

    } catch (error) {
        console.error("Contact Submission Error:", error);
        
        let errorMessage = "Failed to submit contact form";
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            errorMessage = "Invalid data format: " + error.message;
            statusCode = 400;
        } else if (error.code === 11000) {
            // Handle duplicate submissions (if you add unique index on email)
            errorMessage = "You've already submitted a message with this email";
            statusCode = 409;
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage
        });
    }
};