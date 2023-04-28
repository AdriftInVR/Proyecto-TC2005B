const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'gaia',
    password: 'Gaiayaxmo123#',
});

module.exports = pool.promise();