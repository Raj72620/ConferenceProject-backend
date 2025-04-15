// const Contact = require("../models/Contact");
// const h="hi";
const Contact=require("../models/Contact");
const nodemailer = require("nodemailer");

exports.submitContact = async (req, res) => {
    console.log(req.body);
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();
        res.status(200).json({ message: "Contact request submitted successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
