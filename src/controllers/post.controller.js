const postService = require('../services/post.service');

const createPost = async(req, res) => {
    const post = req.body;
    const ownerId = req.params.ownerId;

    const serviceResponse = await postService.insert(post, ownerId)
    return res.send(serviceResponse);
}

const getPosts = async(req, res) => {
    const { filters } = req.body;
    const serviceResponse = await postService.items(filters);
    return res.send(serviceResponse);
}

const updateById = async(req, res) => {
    const { postId } = req.params;
    const { changes } = req.body; // new post content, it may be content or attached images

    const serviceResponse = await postService.updateById(postId, changes);
    return res.send(serviceResponse);
}

module.exports = {
    createPost,
    getPosts,
    updateById
}