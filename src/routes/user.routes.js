const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const tryCatch = require('../utils/tryCatch');

// Middlewares
const errorHandler = require('../middlewares/errorHandler');
const authenticate = require('../middlewares/authenticate');
const userDataValidator = require('../middlewares/userDataValidator');
const validator = require('../middlewares/propertyValidator');

// Swagger user routes
router.get('/itemBy/:filter?', 
    errorHandler, 
    validator,
    tryCatch(userController.getUserBy));
router.post('/', errorHandler, userDataValidator,  tryCatch(userController.addUser));
router.get('/', errorHandler, tryCatch(userController.getUsers));
router.put('/:userId', errorHandler, authenticate, tryCatch(userController.updateUser));
router.delete('/:userId', errorHandler, authenticate, tryCatch(userController.deleteUser));

module.exports = router;