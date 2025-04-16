const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    paperId: { type: String, required: true },
    paperTitle: { type: String, required: true },
    institution: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },          // Changed from amountPaid
    fee_category: { type: String, required: true },    // Changed from feePaid
    transaction_id: { type: String, required: true },  // Changed from transactionId
    registration_date: { type: Date, required: true }, // Added field
    journalName: { type: String }                      // Optional field
});

const Registration = mongoose.model("Registration", RegistrationSchema);
module.exports = Registration;
