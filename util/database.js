const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    database: 'gaia', 
    password: BD_PASS,
});

module.exports = pool.promise();