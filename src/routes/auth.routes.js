const express = require('express');
const router = express.Router();
const tryCatch = require('../utils/tryCatch');

const authController = require('../controllers/auth.controller');
const errorHandler = require('../middlewares/errorHandler');

// endpoints
router.post('/login', errorHandler, tryCatch(authController.login));
router.post('/register', errorHandler, tryCatch(authController.register));



module.exports = router;