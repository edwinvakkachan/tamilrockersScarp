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

    $("a[href]").each((_, element) => {
      let href = $(element).attr("href");

      if (!href) return;

      // Convert relative URLs to absolute
      if (href.startsWith("/")) {
        href = new URL(href, BASE_URL).href;
      }

      const lowerHref = href.toLowerCase();

  

      // Optional: Skip PreDVD if you want
      // if (lowerHref.includes("predvd")) return;

      if (!lowerHref.includes("/forums/topic/")) return;


    });

  
    console.log(`\nTotal Found: ${links.size}`);
    console.log(links)

    return links;

  } catch (error) {
    console.error("Error:", error.message);
  }
}

