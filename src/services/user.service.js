const mysql = require('mysql');
const db = require('../config/dbConnection');
const bcrypt = require('bcrypt');
const UserError = require('../errors/UserError');


/**
 * Create a new user object
 * @param {Array} User - { username, email, password } 
 * @returns An http response status or error code
 */
const insert = async(user) => { 
    // Save on data base
    const hash = await bcrypt.hash(user.password, 3);
    user.password = hash;
    db.query('INSERT INTO users SET ?', user, (err, _) => {
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
    throw new UserError(233, 'Something went wrong bro', 200);
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

const updateItemById = async(userId, data) => {
    return new Promise((resolve, reject) => {
        const properties = Object.getOwnPropertyNames(data);
        if(hasInvalidProperty()){
            reject({
                status: 400,
                error: 'Invalid property',
                inputRecieved: data
            })
        }

        for (const property of properties){
            let sql = "UPDATE users SET " + property + ' = ? WHERE id = ' + mysql.escape(userId);
            if(property === 'password') {
                let hash = bcrypt.hash(data.password, 3);
                data.password = hash;
            }
            db.query(sql, data[property], (err, result) => {
                if(err){
                    reject({
                        status: 500,
                        error: err
                    })
                }
            })
        }

        resolve({
            status: 200,    
            message: 'OK'
        })
    })
}

/**
 * Check if there is an invalid property to update in some user
 * @param { String[] } Properties 
 * @returns { boolean } does array have invalid property?
 */
const hasInvalidProperty = (properties) => {
    const validProperties = [
        'username',
        'email',
        'password'
    ]

    let hasInvalid = validProperties.map(property => {
        return
    })

    console.log(hasInvalid);

    return true;
}

module.exports = {
    insert,
    items,
    itemById,
    updateItemById
}