const mysql = require('mysql');
const db = require('../config/dbConnection');
const bcrypt = require('bcrypt');
const UserError = require('../errors/UserError');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new user object
 * @param {Array} User - { username, email, password } 
 * @returns An http response status or error code
 */
const insert = async(user) => { 
    // make sure user doesnt exist
    let data = await getUserBy('username', user.username);
    if(data.user._id){
        return {
            status: 200,
            message: 'Username already exists'
        }
    }

    try{
        // Encrypt pw
        const hash = await bcrypt.hash(user.password, 3);
        user.password = hash;
        user._id = uuidv4();
        // Save on data base
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users SET ?', user, (err, _) => {
                if(err){ reject(err) }
        
                resolve({
                    status: 200,
                    message: 'OK',
                    userId: user._id
                })
            })
        })
    }catch(err){
        throw (err);
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
            if(err){ reject(err.message) }

            resolve({
                status: 200,
                users: row
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
const updateItem = async(userId, data) => {
    // make sure user exists
    let userData = await getUserBy('_id', userId);
    if(!userData.user._id){
        return {
            status: 200,
            err: 'User not found',
            user: []
        }
    }

    return new Promise((resolve, reject) => {
        const properties = Object.getOwnPropertyNames(data);

        let invalidProperties = hasInvalidProperty(properties);
        if(invalidProperties.length > 0){
            throw new 
            UserError(300, 'Unexpected invalid properties.', 200, invalidProperties);
        }

        properties.forEach(async(property) => {
            let sql = "UPDATE users SET " + property + ' = ? WHERE _id = ' + mysql.escape(userId);
            if(property === 'password') {
                data.password = String(data.password); // make sure we're recieving a string
                let hash = await bcrypt.hash(data.password, 3);
                data.password = hash;
            }
            db.query(sql, data[property], (err, _) => {
                if(err){ reject(err) }
            })
        })

        resolve({
            status: 200,    
            message: 'User updated successfully.'
        })
    })
}


/**
 * Check if there is an invalid property to update in user schema
 * @param {String} Properties - They must be: username, email or password
 * @returns { Array } Invalid properties found
 */
const hasInvalidProperty = (properties) => {
    // _id generates itself by uuid package
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
 * Search an specific user following a filter
 * @param {String} Filter - It may be: username, _id or email
 * @param {String} Param - Contains what you want to search
 * @returns An user object if exists or a not found message.
 */
const getUserBy = async(filter, param) => {
    const availableFilters = [
        '_id',
        'username',
        'email'
    ]

    // make sure we're recieving a valid filter keyword
    let filterResults = availableFilters.filter(tempFilter => tempFilter === filter);
    if(filterResults.length === 0) { 
        return {
            status: 400,
            message: 'Please, provide a valid filter keyword: _id, username or email',
            invalidKeyword: filter,
        }
    }

    let sql = "SELECT * FROM users WHERE " + filter + ' = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [param], (err, row) => {
            if(err) { reject(err) }
            if(row.length === 0){
                resolve({ 
                    status: 200,
                    user: [],
                    message: 'User not found'
                });
            }

            user = JSON.parse(JSON.stringify(row));
            resolve({
                status: 200,
                user: user[0]
            });
        })
    })
}   

/**
 * Delete an item by ID
 * @param { string } - User ID
 * @return { Array } - Returns an http code and OK as response
 */
const deleteItem = async(id) => {
    // make sure user exists
    let data = await getUserBy('_id', id);
    if(!data.user._id){
        return {
            status: 200,
            message: 'User does not exist',
            user: []
        }
    }

    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM users WHERE _id = ?"
        db.query(sql, [id], (err, result) => {
            if(err) { reject(err); }

            resolve({
                status: 200,
                message: 'User deleted successfully',
            });
        })
    })
}


module.exports = {
    insert,
    items,
    updateItem,
    getUserBy,
    deleteItem
}