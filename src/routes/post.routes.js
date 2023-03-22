const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller')
const tryCatch = require('../utils/tryCatch');

// middls
const authenticate = require('../middlewares/authenticate')
const errorHandler = require('../middlewares/errorHandler');

// post - swagger
router.post('/:ownerId', errorHandler, authenticate, tryCatch(postController.createPost));
router.put('/:postId', errorHandler, authenticate, tryCatch(postController.updateById));
router.get('/', errorHandler, tryCatch(postController.getPostsBy));
router.delete('/:postId', errorHandler, authenticate, tryCatch(postController.deleteById))

module.exports = router;