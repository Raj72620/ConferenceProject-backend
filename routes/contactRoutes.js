// const express = require("express");
// const router = express.Router();
// const { submitContact } = require("../controllers/contactController");

// router.post("/contacts", submitContact);

// module.exports = router;
const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contactController");

router.post("/contact", submitContact);  // This matches /api/contact

module.exports = router; 
