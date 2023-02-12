const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Swagger
router.get('/item/:userId', userController.getUserById);
router.post('/', userController.addUser);
router.get('/', userController.getUsers);
router.put('/:userId', userController.updateUser);

module.exports = router;