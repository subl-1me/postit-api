const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE
});

module.exports = connection;