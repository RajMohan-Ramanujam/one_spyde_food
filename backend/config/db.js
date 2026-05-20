const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'one_spyde',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.getConnection()
  .then(connection => {
    console.log('Database connected successfully to MySQL!');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

module.exports = db;
