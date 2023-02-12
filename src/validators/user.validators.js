const mysql  = require('mysql');
const db = require('../config/dbConnection');

const validateUserData = async (user) => {
    const { username, email } = user;

    // Check if username already exists
    let validateErrors = [];
    let emailErrors = await checkDuplicatedEmail(email);
    let usernameErrors = await checkDuplicatedUsername(username);

    if(emailErrors) { validateErrors.push(emailErrors) }
    if(usernameErrors) { validateErrors.push(usernameErrors) }

    return validateErrors;  
}

const checkDuplicatedEmail = async(email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ' + mysql.escape(email);
        db.query(sql, (err, result) => {
            if(err){ reject(err.message) }

            if(result && result.length > 0) { resolve('Email already taken.') };
            resolve();
        })
    })
}

const checkDuplicatedUsername = async(username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ' + mysql.escape(username);
        db.query(sql, (err, result) => {
            if(err){ reject(err.message) }

            if(result  && result.length > 0) { resolve('Username already taken.') };
            resolve();
        })
    })
}


module.exports = validateUserData;