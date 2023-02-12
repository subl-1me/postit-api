const express = require('express');
const router = express.Router();


/**
 * @openapi
 * /api/post:
 *  post:
 *      tags:
 *          - Post
 *      description: Insert a new post object
 */
router.post('/', (req, res) => {

})

router.get('posts', () => {

})

module.exports = router;