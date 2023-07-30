const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.db_user,
    password: process.env.db_password,
    database: 'employee_tracker'
})

console.log('Successfully connected to the database!')

module.exports = db;