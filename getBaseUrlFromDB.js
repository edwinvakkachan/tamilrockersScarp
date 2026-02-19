import { initDB } from "./db/db.js";

export async function getBaseUrl() {
  const db = await initDB();

  const result = await db.query(
    "SELECT value FROM settings WHERE key = $1",
    ["current_domain"]
  );

  if (result.rows.length === 0) {
    throw new Error("Base URL not found in DB");
  }

  return result.rows[0].value;
}
