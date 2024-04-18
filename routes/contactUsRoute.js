const express = require('express');
const protect = require('../middlewares/authMiddleware');
const { contactUs } = require('../controllers/contactUsController');

const router = express.Router();

router.post("/", protect, contactUs)

module.exports = router;