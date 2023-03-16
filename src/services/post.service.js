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
    'popular'
]

const insert = async(post, ownerId) => {
    // insert new post
    let sql = "INSERT INTO posts SET ?";
    post.ownerId = ownerId;
    post._id = uuidv4();

    return new Promise((resolve, reject) => {
        db.query(sql, post, (err, result) => {
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
 * Get items list by a list of filters, they may be: 
 * userId, username, sortType (recent, older, top)
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
        console.log(sql);
        promises.push(createSqlUpdateQuery(sql, changes[property]));
    })

    await Promise.all(promises);
    return {
        status: 200,
        message: 'Post updated successfully'
    }
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
    updateById
}