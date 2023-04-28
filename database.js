const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'gaia',
    password: BD_PASS,
});

module.exports = pool.promise();