const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'one_spyde';

  console.log(`Attempting to connect to MySQL server at ${host}:${port} as ${user}...`);

  let connection;
  try {
    // Connect without specifying database to create it
    connection = await mysql.createConnection({ host, port, user, password });
    console.log('Connected to MySQL server.');

    // Create database
    console.log(`Creating database '${dbName}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log('Database checked/created.');
    await connection.end();

    // Reconnect to the specific database
    connection = await mysql.createConnection({ host, port, user, password, database: dbName, multipleStatements: true });
    console.log(`Connected to database '${dbName}'.`);

    // Read schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Reading database schema SQL script...');

    // Execute schema queries (using multipleStatements: true)
    console.log('Executing database schema and seed data...');
    await connection.query(schemaSql);

    console.log('==================================================');
    console.log(' Database initialized and seeded successfully! ');
    console.log('==================================================');
  } catch (error) {
    console.error('==================================================');
    console.error(' Database Initialization Failed!');
    console.error(' Error details:', error.message);
    console.error('==================================================');
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (e) {}
    }
  }
}

initializeDatabase();
