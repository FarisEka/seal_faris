const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'seal_db_faris'
});

const promisePool = pool.promise();

module.exports = promisePool;
