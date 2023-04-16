const CommentService = require('../services/comment.service');
const CommentServiceInstance = new CommentService();

/**
 * @description Create a comment with the provided body
 * @param {*} req Express req object
 * @param {*} res Express res object
 * @returns {Promise<*>}
 */
const insertComment = async(req, res) => {
    try{
        const { body } = req; //TODO: Create a function to validate body params
        if(!body.postId){
            throw new Error('Post ID is required')
        }
    
        const serviceRes = await CommentServiceInstance.insert(body);
        return res.send(serviceRes);
    }catch(err){
        throw new Error(err);
    }
}

/**
 * Update a comment following a list of filters
 * @param {*} req Express req object
 * @param {*} res Express res object
 * @returns {Promise<*>}
 */
const updateCommentById = async(req, res) => {
    const { commentId } = req.params;
    const filters = req.body;
    if(!commentId){
        throw new Error('Comment ID is required');
    }

    try{
        const serviceRes = await CommentServiceInstance.updateById(commentId, filters);
        return res.send(serviceRes);
    }catch(err){
        throw new Error(err);
    }
}

const deleteComment = async(req, res) => {
    const { commentId } = req.params;
    if(!commentId){
        throw new Error('Comment ID is required');
    }

    try{
        const serviceRes = await CommentServiceInstance.remove(commentId);
        return res.send(serviceRes);
    }catch(err){
        throw new Error(err);
    }
}

/**
 * @description Get all comments
 * @param {*} req Express req object
 * @param {*} res  Express res object
 * @returns {Promise<*>}
 */
const getComments = async(req, res) => {

    try{
        const serviceRes = await CommentServiceInstance.items();
        return res.send(serviceRes);
    }catch(err){
        throw new Error(err);
    }
    
}

const getCommentById = async(req, res) => {
    const { commentId } = req.params;
    if(!commentId){
        throw new Error('Comment ID is required');
    }

    try{
        const serviceRes = await CommentServiceInstance.itemById(commentId);
        return res.send(serviceRes);
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {
    insertComment,
    deleteComment,
    getCommentById,
    getComments,
    updateCommentById
}



