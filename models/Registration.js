const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    paperId: { type: String, required: true },
    paperTitle: { type: String, required: true },
    institution: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    amountPaid: { type: String, required: true },
    journalName: { type: String },
    feePaid: { type: String, required: true },
    transactionId: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", RegistrationSchema);
module.exports = Registration;
