const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Full name is required"],
        trim: true
    },
    paperId: {
        type: String,
        required: [true, "Paper ID is required"],
        uppercase: true
    },
    paperTitle: {
        type: String,
        required: [true, "Paper title is required"],
        trim: true
    },
    institution: {
        type: String,
        required: [true, "Institution/Organization is required"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function(v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid Indian phone number!`
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    amount: {
        type: Number,
        required: [true, "Amount paid is required"],
        min: [0, "Amount cannot be negative"]
    },
    fee_category: {
        type: String,
        required: [true, "Fee category is required"],
        enum: {
            values: ['Research Scholars', 'Faculty Delegates', 'R&D/Industry', 'International', 'Listeners'],
            message: '{VALUE} is not a valid fee category'
        }
    },
    transaction_id: {
        type: String,
        required: [true, "Transaction ID is required"],
        unique: true
    },
    registration_date: {
        type: Date,
        required: [true, "Registration date is required"],
        validate: {
            validator: function(v) {
                return v <= new Date();
            },
            message: "Registration date cannot be in the future"
        }
    },
    journalName: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Compound index remains the same
registrationSchema.index({ paperId: 1, email: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
