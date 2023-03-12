const db = require('../config/dbConnection');
const { v4: uuidv4 } = require('uuid');

const availableFilters = [
    'userId',
    'username',
]

const sortedBy = [
    'recent',
    'older',
    'popular'
]

const insert = async(post, ownerId) => {
    // insert new post
    let sql = "INSERT INTO posts SET ?";
    post.ownerId = ownerId;
    post._id = uuidv4();

    return new Promise((resolve, reject) => {
        db.query(sql, post, (err, result) => {
            if(err){ resolve(err); }

            resolve({
                status: 200,
                message: 'OK',
                post: post
            })
        })
    })

}

/**
 * Get items list by a list of filters, they may be: 
 * userId, username, sortType (recent, older, top)
 * @example { userId: 1234, sortType: 'recent' }
 * @example { username: 'example', sortType: 'older' }
 * @param {*} filters 
 * @returns {*} Items array
 */
const items = async(filters) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM posts', (err, row) => {
            if(err) { reject(err) }

            const posts = JSON.parse(JSON.stringify(row));
            resolve({
                status: 200,
                message: 'OK',
                posts: posts
            })
        })
    })
}

const updateById = async(id) => {
    console.log('authenticated...');
    return {
        postId: id,
        status: 200,
        message: 'OK'
    }
}


module.exports = {
    insert,
    items,
    updateById
}