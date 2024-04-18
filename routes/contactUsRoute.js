const express = require('express');
const protect = require('../middlewares/authMIddleware');
const { contactUs } = require('../controllers/contactUsController');

const router = express.Router();

router.post("/", protect, contactUs)

module.exports = router;