const CommentService = require('../services/comment.service');

const addComment = (req, res) => {

    return res.send('Comment created successfully');
}

/**
 * Update a comment following a list of filters
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateComment = (req, res) => {

    return res.send('Comment updated successfully');
}

const deleteComment = (req, res) => {

    return res.send('Comment deleted successfully');
}

const getComments = (req, res) => {
    
    return res.send('Getting comments...');
}

const getCommentById = (req, res) => {

    return res.send('Getting comment...');
}

module.exports = {
    addComment,
    deleteComment,
    getCommentById,
    getComments,
    updateComment
}



