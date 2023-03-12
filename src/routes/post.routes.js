const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller')
const authenticate = require('../middlewares/authenticate')
const errorHandler = require('../middlewares/errorHandler');
const tryCatch = require('../utils/tryCatch');


// post - swagger
router.post('/:ownerId', errorHandler, authenticate, tryCatch(postController.createPost));
router.put('/:postId', errorHandler, authenticate, tryCatch(postController.updateById));
router.get('/', errorHandler, tryCatch(postController.getPosts));

module.exports = router;