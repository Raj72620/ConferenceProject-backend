
const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contactController");

router.post("/contact", submitContact);  // This matches /api/contact

module.exports = router; 
