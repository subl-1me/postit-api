const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const tryCatch = require('../utils/tryCatch');

// Middlewares
const errorHandler = require('../middlewares/errorHandler');
const authenticate = require('../middlewares/authenticate');
const userDataValidator = require('../middlewares/userDataValidator');

// Swagger user routes
router.get('/item/:userId', errorHandler, tryCatch(userController.getUserById));
router.post('/', errorHandler, userDataValidator,  tryCatch(userController.addUser));
router.get('/', errorHandler, tryCatch(userController.getUsers));
router.put('/:userId', errorHandler, authenticate, tryCatch(userController.updateUser));
router.post('/login', errorHandler, tryCatch(userController.login));
router.delete('/:userId', errorHandler, authenticate, tryCatch(userController.deleteUser));

module.exports = router;