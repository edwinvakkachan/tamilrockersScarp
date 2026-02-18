import { initDB } from "./db/db.js";
import { loginQB ,addMagnet } from "./qbittorrent/qb.js";

export async function addToTorrent (){

   try {
     const db = await initDB();
    
    const rows = await db.all(`
      SELECT * FROM magnets
      WHERE created_at >= datetime('now', '-8 hours')
      ORDER BY created_at DESC
    `);
    await loginQB();
   console.log('adding torretns')
    for (const value of rows){
        await addMagnet(value.magnet);
    }
    console.log(`adding complete`);
   } catch (error) {
    console.error(error)
   }
}