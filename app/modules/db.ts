import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to test the database connection
export async function testConnection() {
  try {
    const response = await pool.query('SELECT NOW()'); // Simple query to test connectivity
    console.log("Database connection successful:", response.rows[0].now); // Log the current time from the database
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Existing query function...
export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}

// Immediately invoke the testConnection function to test connectivity when the module is loaded
testConnection();