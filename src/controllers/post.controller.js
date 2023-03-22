const postService = require('../services/post.service');
const PostError = require('../errors/PostError');

const createPost = async(req, res) => {
    const post = req.body;
    const ownerId = req.params.ownerId;

    const serviceResponse = await postService.insert(post, ownerId)
    return res.send(serviceResponse);
}

const getPostsBy = async(req, res) => {
    const filter = req.body;
    const serviceResponse = await postService.itemsBy(filter);
    return res.status(serviceResponse.status).send(serviceResponse);
}

const updateById = async(req, res) => {
    const { postId } = req.params;
    const { changes } = req.body; // new post content, it may be content or attached images

    const serviceResponse = await postService.updateById(postId, changes);
    return res.send(serviceResponse);
}

const deleteById = async(req, res) => {
    const { postId } = req.params;
    if(!postId){
        throw new PostError(500, 'Post ID is required', 400);
    }

    const serviceResponse = await postService.deleteItem(postId);
    return res.send(serviceResponse);
}

module.exports = {
    createPost,
    getPostsBy,
    updateById,
    deleteById
}