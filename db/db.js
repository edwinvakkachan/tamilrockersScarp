import pkg from "pg";
const { Pool } = pkg;
import 'dotenv/config';
import { delay } from "../delay.js";



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

  //table for link.

    await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);


   await pool.query(`
    INSERT INTO settings (key, value)
    VALUES ('current_domain', 'https://www.1tamilmv.earth')
    ON CONFLICT (key) DO NOTHING
  `);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS processed_links (
    id SERIAL PRIMARY KEY,
    href TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

  return pool;
}


export async function insertLinkIfNew(href) {
  try {
    const result = await pool.query(
      `INSERT INTO processed_links (href)
       VALUES ($1)
       ON CONFLICT (href) DO NOTHING
       RETURNING id`,
      [href]
    );
    await delay(300,true);
    return result.rowCount === 1; // true if new
  } catch (err) {
    console.error("DB insert error:", err.message);
    throw err;
  }
}
