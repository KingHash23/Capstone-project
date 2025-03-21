require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();


// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_portal',
  port: process.env.DB_PORT || 3309,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Log database connection parameters (without password)
console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Create a connection pool
const db = mysql.createPool(dbConfig);

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    console.error('Error code:', err.code);
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Invalid database credentials. Please check your username and password.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database server refused the connection. Please check if the database server is running and the host/port are correct.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Please create the database or check the database name.');
    }
    
    return;
  }
  
  console.log('Database connected successfully!');
  console.log(`Connected to MySQL database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
  connection.release();
});

module.exports = db;
