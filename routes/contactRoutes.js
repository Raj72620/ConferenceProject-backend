
const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contactController");

router.post("/api/contact", submitContact);
module.exports = router; 
