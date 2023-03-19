const db = require('../config/dbConnection');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');

const availableFilters = [
    'userId',
    'username',
]

const sortedBy = [
    'recent',
    'older',
    'mostLiked'
]

/**
 * Insert new item recieving its data and ownerId
 * @param {Post} post 
 * @param {String} ownerId 
 * @returns 200 or SQL error
 */
const insert = async(post, ownerId) => {
    let sql = "INSERT INTO posts SET ?";
    post.ownerId = ownerId;
    post._id = uuidv4();

    return new Promise((resolve, reject) => {
        db.query(sql, post, (err, _result) => {
            if(err){ reject(err); }

            resolve({
                status: 200,
                message: 'OK',
                post: post
            })
        })
    })

}

/**
 * Get items following a list of filters, they should be: 
 * userId, username and sortType (recent, older, top)
 * @example { userId: 1234, sortType: 'recent' }
 * @example { username: 'example', sortType: 'older' }
 * @param {*} filters 
 * @returns {*} Items array
 */
const items = async(filters) => {
    // const { _id, usernane, sortType } = filters;
    // if(_id){
    //     return new Promise((resolve, reject) => {
    //         db.query('SELECT * FROM posts WHERE _id = ?', _id, (err, result) => {
    //             if(err) { reject(err) }

    //             console.log(result);
    //             resolve({
    //                 status: 200,
    //                 message: 'ok'
    //             })
    //         })
    //     })
    // }


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

/**
 * Update a post by ID
 * @param {String} postId - Post ID
 * @param {Array} changes - Array of properties to update, they may be: content or images
 * @returns Http response
 */
const updateById = async(postId, changes) => {
    const properties = Object.getOwnPropertyNames(changes);

    let promises = [];
    properties.forEach((property) => {
        let sql = "UPDATE posts SET " + String(property) + " = ? WHERE _id = " + mysql.escape(postId);
        promises.push(createSqlUpdateQuery(sql, changes[property]));
    })

    try {
        await Promise.all(promises);
        return {
            status: 200,
            message: 'Post updated successfully'
        }
    }catch(err){
        throw err;
    }


}

/**
 * Delete an item by its ID
 * @param {String} id 
 * @returns 
 */
const deleteItem = (id) => {
    let sql = "DELETE FROM posts WHERE _id = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, _result) => {

            if(err) { reject(err) }

            resolve({
                status: 200,
                message: 'Post deleted successfully'
            })
        })
    })
}

/**
 * Creates an udpate query
 * @param {String} sql - SQL query string 
 * @param {String} value - Value that contains the new data
 * @returns SQL promise
 */
const createSqlUpdateQuery = async (sql, value) => {
    return new Promise((resolve, reject) => {
        db.query(sql, value, (err, result) => {
            if(err) { reject(err) }

            resolve(result);
        })
    })
}


module.exports = {
    insert,
    items,
    updateById,
    deleteItem
}