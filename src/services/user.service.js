const mysql = require('mysql');
const db = require('../config/dbConnection');


/**
 * Create a new user object
 * @param {Array} User - { username, email, password } 
 * @returns An http response status or error code
 */
const insert = async(user) => { 
    // Save on data base
    db.query('INSERT INTO users SET ?', user, (err, res) => {
        if(err){
            return {
                status: 200,    
                message: 'Error trying to insert into users'
            }
        }

    })
    return {
        status: 200,
        message: 'OK',
    }
}

/**
 * Get all users
 * @returns An array of Users
 */
const items = async() => {
    // Get data from db
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users', (err, row) => {
            if(err){
                reject({
                    status: 200,
                    error: err
                })

            }

            resolve({
                status: 200,
                users: row
            })
        })
    })
}

const itemById = async (id) => {
    
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM users WHERE id = ' + mysql.escape(id);
        db.query(sql, (err, result) => {
            if(err){
                reject({
                    status: 200,
                    error: err
                })
            }

            if(result) { 
                resolve({ 
                    status: 200,
                    user: result[0]
                }) 
            }

            resolve({
                status: 200,
                user: null
            });
        })
    })
}

const updateItemById = async(userId) => {
    let sql = 'UPDATE users SET '
    return new Promise((resolve, reject) => {

    })
}

module.exports = {
    insert,
    items,
    itemById
}