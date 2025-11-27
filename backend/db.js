const mysql = require('mysql2');

// Railway MySQL connection with SSL support
// Try multiple password variable names (Railway uses different ones)
const password = process.env.DB_PASSWORD || 
                 process.env.MYSQLPASSWORD || 
                 process.env.MYSQL_ROOT_PASSWORD ||
                 process.env.MYSQLPASSWORD_ROOT;

const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: password,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false  // Railway uses self-signed certificates
  }
};

// Validate required fields
if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
  console.error('Missing required database configuration. Please check your .env file.');
  console.error('Required: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT');
  console.error('Current values:', {
    host: dbConfig.host ? '✓' : '✗',
    user: dbConfig.user ? '✓' : '✗',
    password: dbConfig.password ? '✓' : '✗',
    database: dbConfig.database ? '✓' : '✗',
    port: dbConfig.port
  });
}

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.error('Database config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      passwordSet: dbConfig.password ? 'Yes' : 'No',
      passwordLength: dbConfig.password ? dbConfig.password.length : 0
    });
    return;
  }
  console.log('Database connected successfully');
  console.log(`Database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
  connection.release();
});

module.exports = promisePool;

