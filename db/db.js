import pkg from "pg";
const { Pool } = pkg;
import 'dotenv/config';



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS magnets (
      id SERIAL PRIMARY KEY,
      magnet TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return pool;
}
