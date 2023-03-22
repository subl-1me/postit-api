const db = require('../config/dbConnection');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');

const availableFilters = [
    '_id',
    'ownerId',
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
    post.likes = 0;

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
 * Get items by following a filter
 * @example { ownerId: 'uuid-2ffd' } 
 * @example { _id: 'uuid-223' }
 * @param {*} filter It may be ownerId or postId
 * @returns {*} Items array
 */
const itemsBy = async(filter) => {
    let properties = Object.getOwnPropertyNames(filter);
    let sql = '';

    if(properties.length === 0){ // case no filters
        sql = `SELECT * FROM posts`;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, row) => {
                if(err) { reject(err) }

                resolve({
                    status: 200,
                    message: 'OK',
                    posts: row
                })
            })
        })
    }else{

        let invalidProperties = propertyChecker(properties);
        if(invalidProperties.length !== 0){
            return{
                status: 400,
                message: 'An invalid input was caught',
                input: invalidProperties
            }
        }

        const propertyToSearch = properties[0];
        sql = "SELECT * FROM users WHERE ' + propertyToSearch + ' = ?";
        return new Promise((resolve, reject) => {
            db.query(sql, filter[propertyToSearch], (err, row) => {
                if(err) { reject(err) }
                // const posts = JSON.parse(JSON.stringify(row));
                resolve({   
                    status: 200,
                    message: 'OK',
                    post: row
                })
            })
        })
    }
}

const propertyChecker = (properties) => {
    let invalidProperties = [];
    for(const property of properties){
        let match = availableFilters.find(_property => _property === property);
        if(!match) invalidProperties.push(property);
    }

    return invalidProperties;
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
    itemsBy,
    updateById,
    deleteItem
}