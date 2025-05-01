const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registrationController");
const validateRegistration = require("../middleware/validateRegistration");

router.post("/", validateRegistration, registerUser);
module.exports = router;