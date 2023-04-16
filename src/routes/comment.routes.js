const express = require('express');
const router = express.Router();
const tryCatch = require('../utils/tryCatch');

const CommentController = require('../controllers/comment.controller');

// middls
const authenticate = require('../middlewares/authenticate');
const errorHandler = require('../middlewares/errorHandler');

// endpoints
router.post('/', 
    errorHandler, 
    authenticate, 
    tryCatch(CommentController.insertComment));
router.get('/', errorHandler, tryCatch(CommentController.getComments));
router.get('/:commentId', errorHandler, tryCatch(CommentController.getCommentById));
router.put('/:commentId', errorHandler, authenticate, tryCatch(CommentController.updateCommentById));
router.delete('/:commentId', errorHandler, authenticate, tryCatch(CommentController.deleteComment));


module.exports = router;
