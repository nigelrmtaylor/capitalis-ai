import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

// Create a new Pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to test the database connection
export async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1'); // Simple query to test connection
    console.log('\nDatabase Connection:');
    console.log('  Successfully connected to PostgreSQL');
    console.log(`  URL: ${process.env.DATABASE_URL}`);
    return pool;
  } catch (error) {
    console.error('\nDatabase Connection Error:');
    console.error(`  Could not connect to PostgreSQL database at ${process.env.DATABASE_URL}`);
    console.error('  Please check that:');
    console.error('    1. PostgreSQL is running');
    console.error('    2. Database credentials are correct');
    console.error('    3. Database server is accepting connections');
    console.error(`  Error details: ${error.message}`);
    if (error.stack) {
      console.error('  Stack trace:', error.stack);
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { pool };
