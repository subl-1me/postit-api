const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const errorHandler = require('../handlers/errorHandler');
const tryCatch = require('../utils/tryCatch');

// Swagger
router.get('/item/:userId', userController.getUserById);
router.post('/', userController.addUser);
router.get('/', errorHandler, tryCatch(userController.getUsers));
router.put('/:userId', userController.updateUser);

module.exports = router;