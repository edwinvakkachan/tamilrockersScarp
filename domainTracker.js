import axios from "axios";
import dotenv from "dotenv";
import { initDB } from "./db/db.js";   // your existing DB connection

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// const CHECK_INTERVAL =
//   (process.env.CHECK_INTERVAL_HOURS || 6) * 60 * 60 * 1000;


// Telegram Sender
async function sendTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: "Markdown"
  });
}


// Get Final Redirect
async function getFinalUrl(url) {
  try {
    const response = await axios.get(url, {
      maxRedirects: 10,
      timeout: 10000
    });

    return response.request.res.responseUrl;

  } catch (err) {
    console.error("Request Error:", err.message);
    return null;
  }
}


// Extract Domain
function extractDomain(url) {
  return new URL(url).origin;
}


// Core Logic
export async function checkDomain() {
  const db = await initDB();

  const result = await db.query(
    "SELECT value FROM settings WHERE key = $1",
    ["current_domain"]
  );

  if (result.rows.length === 0) {
    console.log("No domain found in DB.");
    return;
  }

  const currentDomain = result.rows[0].value;

  console.log(`[${new Date().toISOString()}] Checking ${currentDomain}`);

  const finalUrl = await getFinalUrl(currentDomain);
  if (!finalUrl) return;

  const newDomain = extractDomain(finalUrl);

  if (newDomain !== currentDomain) {

    await db.query(
      "UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP WHERE key = $2",
      [newDomain, "current_domain"]
    );

    const message = `
🚨 *Domain Updated*

Old: ${currentDomain}
New: ${newDomain}
Time: ${new Date().toLocaleString()}
`;

    await sendTelegram(message);

    console.log("Domain updated in DB:", newDomain);
  } else {
    await sendTelegram("Domain unchanged.")
    console.log("Domain unchanged.");
  }
}
