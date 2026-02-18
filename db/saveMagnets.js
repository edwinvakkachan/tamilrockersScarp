import { initDB } from "./db.js";

export async function saveMagnets(magnetLinks) {
  const db = await initDB();

  for (const magnet of magnetLinks) {
    await db.run(
      `INSERT OR IGNORE INTO magnets (magnet) VALUES (?)`,
      magnet
    );
  }

  await db.close();
}
