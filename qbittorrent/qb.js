import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import dotenv from "dotenv";
dotenv.config();
import { delay } from "../delay.js";

const jar = new CookieJar();

export const qb = wrapper(axios.create({
  baseURL: process.env.QBITIP,
  jar,
  withCredentials: true
}));

export async function loginQB() {
  await qb.post("/api/v2/auth/login", 
    new URLSearchParams({
      username: process.env.QBITUSER,
      password: process.env.QBITPASS
    })
  );
}

export async function addMagnet(magnet) {

  const today = new Date().toISOString().split("T")[0]; 

  await qb.post("/api/v2/torrents/add",
    new URLSearchParams({
      urls: magnet,
      category: "2tbEnglish",
      tags: `malayalam,script,${today}`
        // optional
    })
  );
}

export async function moveTorrentToTop(){
  const { data: torrents } = await qb.get("/api/v2/torrents/info");

  const addedTorrent = torrents
    .filter(t => t.tags.includes(today))
    .sort((a, b) => b.added_on - a.added_on)[0];

  if (!addedTorrent) {
    console.log("❌ Torrent not found after adding.");
    return;
  }
  await delay(2000)
  // 4️⃣ Move it to top priority
  await qb.post(
    "/api/v2/torrents/topPrio",
    new URLSearchParams({
      hashes: addedTorrent.hash
    })
  );

  console.log(`✅ Moved "${addedTorrent.name}" to top of queue.`);
}
