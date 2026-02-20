import { initDB } from "./db.js";
import { delay } from "../delay.js";

export async function saveMagnets(magnetLinks) {
  const db = await initDB();

  for (const magnet of magnetLinks) {
    await db.query(
      `INSERT INTO magnets (magnet)
       VALUES ($1)
       ON CONFLICT (magnet) DO NOTHING`,
      [magnet]
    );

    await delay(300,true);
  }
}
