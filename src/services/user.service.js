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
    // Encrypt pw
    const hash = await bcrypt.hash(user.password, 3);
    user.password = hash;
    if(!hash) throw new Error('Unexpected error trying to hash password.')

    // Save on data base
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO users SET ?', user, (err, _) => {
            if(err){ reject(err.message) }
    
            resolve({
                status: 200,
                message: 'OK'
            })
        })
    })
}

/**
 * Get all users
 * @returns An array of Users
 */
const items = async() => {
    // Get data from db
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users', (err, row) => {
            if(err){ reject(err.message) }

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
            if(err){ reject(err.message) }

            resolve({
                status: 200,
                user: result[0]
            })
        })
    })
}

/**
 * 
 * @param {String} userId 
 * @param {Array} data 
 * @returns {Array} - A successfully or invalid http response
 */
const updateItemById = async(userId, data) => {
    return new Promise((resolve, reject) => {
        const properties = Object.getOwnPropertyNames(data);

        let invalidProperties = hasInvalidProperty(properties);
        console.log(invalidProperties);
        if(invalidProperties.length > 0){
            throw new 
            UserError(300, 'Unexpected invalid properties.', 200, invalidProperties);
        }

        for (const property of properties){
            let sql = "UPDATE users SET " + property + ' = ? WHERE id = ' + mysql.escape(userId);
            if(property === 'password') {
                let hash = bcrypt.hash(data.password, 3);
                data.password = hash;
            }
            db.query(sql, data[property], (err, result) => {
                if(err){ reject(err.message) }
            })
        }

        resolve({
            status: 200,    
            message: 'User updated successfully.'
        })
    })
}

/**
 * @param {Array} User - It may be username or email and password
 * @returns { String } - Token
*/
const login = async(user) => {
    return new Promise((resolve, reject) => {
        const { email, password, username } = user;

        resolve('ok');
    })
}


/**
 * Check if there is an invalid property to update in user schema
 * @param {String} Properties - They must be: username, email or password
 * @returns { Array } Invalid properties found
 */
const hasInvalidProperty = (properties) => {
    const validProperties = [
        'username',
        'email',    
        'password'
    ]

    let invalidProperties = [];
    for(const property of properties){
        let propertyChecker = validProperties.find(_property => _property === property);
        if(propertyChecker === undefined){ invalidProperties.push(property) }
    }

    return invalidProperties;
}

/**
 * It checks if username and password recieved match with an existing user
 * @param {*} user 
 * @Returns An array response that can contain errors or user data
 */
const userAuthChecker = async(userRecieved) => {

    const getUser = () => {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE username = ?";
            db.query(sql, [userRecieved.username], (error, result) => {
                if(error){ reject(error.message) }

                resolve(result);
            })
        })
    }   

    const data = await getUser();
    const dataParsed = JSON.parse(JSON.stringify(data));

    return {
        status: 200,
        isDataValid: true,
        user: dataParsed[0],
        errors: []
    }
}

/**
 * Delete an item by ID
 * @param { string } - User ID
 * @return { Array } - Returns an http code and OK as response
 */
const deleteItem = async(id) => {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM users WHERE id = ?"
        db.query(sql, [id], (err, result) => {
            if(err) { reject(err); }

            resolve({
                status: 200,
                message: 'User deleted successfully',
                sqlMessage: result
            });
        })
    })
}


module.exports = {
    insert,
    items,
    itemById,
    updateItemById,
    login,
    userAuthChecker,
    deleteItem
}