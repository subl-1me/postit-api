const db = require('../config/dbConnection');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');

const validProperties = [
    'images',
    'content',
    'liked'
]

class CommentService {
    /**
     * @description Creates a new instance of CommentService
     */
    constructor(){ //TODO: Develop the conection with SQL Access Data Layer

    }

    /**
     * @description Insert a new item using the privided body
     * @param {*} body Object containing all item fields
     * @Promise { success: boolean, error|body: * }
     */
    async insert(body){
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO comments SET ?";
            body._id = uuidv4(); // generate uuid
            db.query(sql, body, (err, result) => {
                if(err){ reject(err) }

                resolve({
                    success: true,
                    body: result,
                    commentId: body._id
                })
            })
        })
    }

    /**
     * @description Get a list of items
     * @Promise { success: boolean, error|comments: * }
     */
    async items(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM comments";
            db.query(sql, (err, row) => {
                if(err) { reject(err) }

                resolve({
                    success: true,
                    comments: row
                })
            })
        })
    }

    /**
     * @description Get a item by its ID
     * @param {String} id Unique item ID 
     * @Promise { success: boolean, error|body: * }
     */
    async itemById(id){
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM comments WHERE _id = ' + mysql.escape(id);
            db.query(sql, (err, result) => {
                if(err) { reject(err) }

                resolve({
                    success: true,
                    comment: result
                })
            })
        })
    }

    async remove(id){
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM comments WHERE _id = ?";
            db.query(sql, id, (err, result) => {
                if(err) { reject(err) };

                resolve({
                    success: true,
                    message: 'Comment was deleted successfully',
                })
            })
        })
    }

    /**
     * @description Update an item by its ID following a few list of filters
     * @param {String} id 
     * @param {*} filters - They may be one or all of the following:
     * { content: string, images: *, addLike: true }
     * @example { content: 'this is my new content', images: {*} }
     * @example { images: [{ url, _id }] }
     * @example { liked: true }
     * @returns 
     */
    async updateById(id, filters){   
        let sql;
        const properties = Object.getOwnPropertyNames(filters);
        let checker = this.propertyChecker(properties);
        if(checker.length !== 0){
            return {
                success: false,
                message: 'There are invalid properties in body request',
                properties: checker
            }
        }

        // case is liekd by another user
        const isLiked = properties.find(prop => prop === 'liked');
        if(isLiked){
            sql = "UPDATE comments SET likes = likes+1 WHERE _id = ?";
            const res = await this.createUpdateQuery(sql, id);

            return {
                success: true,
                message: 'Post liked successfully',
                body: res
            }

        }else{
            // case is not liket but updated by owner
            let promises = [];
            properties.forEach(property => {
                sql = "UPDATE comments SET " + property + " = ? WHERE _id = ? ";
                promises.push(this.createUpdateQuery(sql, id, filters[property]));
            })

            await Promise.all(promises);;
            const res = await this.itemById(id);
            const { comment } = res;

            return {
                success: true,
                message: 'Comment updated successfully',
                updatedComment: comment
            }
        }
    }

    propertyChecker(properties){
        let invalidProperties = [];

        for(const property of properties){
            let isValid = validProperties.find(prop => prop === property);
            if(!isValid){
                invalidProperties.push(property);
            }
        }

        return invalidProperties;
    }

    async createUpdateQuery(sql, commentId, data){
        return new Promise((resolve, reject) => {
            if(data){
                db.query(sql, [data, commentId], (err, result) => {
                    if(err) { reject(err) }
    
                    resolve(result);
                })
            }else{
                db.query(sql, commentId, (err, result) => {
                    if(err) { reject(err) }

                    resolve(result);
                })
            }
        })
    }
}

module.exports = CommentService;