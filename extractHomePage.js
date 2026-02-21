import axios from "axios";
import { load } from "cheerio";
import { getBaseUrl } from "./getBaseUrlFromDB.js";
import { sendMessage } from "./telegram/sendTelegramMessage.js";


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

// $("a[href]").each((_, element) => {
//   let href = $(element).attr("href");

//   if (!href) return;

//   // Convert relative to absolute
//   if (href.startsWith("/")) {
//     href = new URL(href, BASE_URL).href;
//   }

//   const lowerHref = href.toLowerCase();
//   const text = $(element).text().toLowerCase().trim();

//   // Must be topic page
//   if (!lowerHref.includes("/forums/topic/")) return;

//   // ❌ Skip PreDVD (check both URL and title)
//   if (
//     lowerHref.includes("predvd") ||
//     text.includes("predvd")
//   ) return;

//   // Must contain Malayalam in text
//   if (
//     !text.includes("malayalam") &&
//     !/\bmal\b/.test(text) 
//   ){
// if(!lowerHref.includes("malayalam") &&
//     !/\bmal\b/.test(lowerHref)) {
// return;
//     }

//   } 


//   links.add(href);
// });


const languageRegex = /\b(malayalam|mal|tamil|tam)\b/i;

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
    console.log(links)

    return links;

  } catch (error) {
    console.error("Error:", error.message);
  }
}

