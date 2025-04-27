const express = require('express');
const router = express.Router();

// POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, Email, and Message are required" });
    }

    // Here, you can save to MongoDB if you have a Contact model
    // await Contact.create({ name, email, phone, message });

    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
