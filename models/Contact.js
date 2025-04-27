const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
        index: true
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        maxlength: [100, "Email cannot exceed 100 characters"],
        index: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: { 
        type: String, 
        trim: true,
        maxlength: [20, "Phone number cannot exceed 20 characters"],
        index: true
    },
    message: { 
        type: String, 
        required: [true, "Message is required"],
        trim: true,
        maxlength: [1000, "Message cannot exceed 1000 characters"]
    },
    date: { 
        type: Date, 
        default: Date.now,
        index: true 
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Add compound index to prevent duplicate submissions from same email within short time
ContactSchema.index({ email: 1, createdAt: 1 }, { unique: false });

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;