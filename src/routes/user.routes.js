const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const errorHandler = require('../middlewares/errorHandler');
const tryCatch = require('../utils/tryCatch');
const authenticate = require('../middlewares/authenticate');

// Swagger
router.get('/item/:userId', userController.getUserById);
router.post('/', errorHandler,  tryCatch(userController.addUser));
router.get('/', errorHandler, tryCatch(userController.getUsers));
router.put('/:userId', errorHandler, authenticate, tryCatch(userController.updateUser));

module.exports = router;