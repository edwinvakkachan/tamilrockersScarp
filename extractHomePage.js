import axios from "axios";
import { load } from "cheerio";
import { getBaseUrl } from "./getBaseUrlFromDB.js";
import { sendMessage } from "./telegram/sendTelegramMessage.js";
import { delay } from "./delay.js";


const BASE_URL = await getBaseUrl();



export async function scrapeMalayalamLinks() {
  try {

console.log(`🍷 current domain is: ${BASE_URL}`);
await sendMessage(`🍷 current domain is: ${BASE_URL}`)

    const { data } = await axios.get(BASE_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 10000
    });
    const $ = load(data);
   

    const links = new Set();

const languageRegex = /\b(malayalam|mal|tamil|tam|hindi|hin)\b/i;

$("a[href]").each((_, element) => {
  const rawHref = $(element).attr("href");
  if (!rawHref) return;

  // Convert relative URL to absolute
  const href = rawHref.startsWith("/")
    ? new URL(rawHref, BASE_URL).href
    : rawHref;

  const lowerHref = href.toLowerCase();
  const text = $(element).text().trim().toLowerCase();

  // Must be topic page
  if (!lowerHref.includes("/forums/topic/")) return;

  // Skip PreDVD (URL or title)
  if (lowerHref.includes("predvd") || text.includes("predvd")) return;

  // Combine text + URL for single language check
  const searchableContent = `${text} ${lowerHref}`;

  // Must contain allowed language
  if (!languageRegex.test(searchableContent)) return;

  links.add(href);
});
  
    console.log(`\nTotal Found: ${links.size}`);
    await delay(2000,true);
 
    return links;

  } catch (error) {
    console.error("Error:", error.message);
  }
}

