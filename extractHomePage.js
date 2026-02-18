import axios from "axios";
import { load } from "cheerio";

const BASE_URL = "https://www.1tamilmv.earth/";

export async function scrapeMalayalamLinks() {
  try {
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

      if(lowerHref.includes('predvd') 
    ){
        return;
      }
      

  // const yearMatch = lowerHref.match(/\b(20\d{2})\b/);

  // if (yearMatch) {
  //   const year = parseInt(yearMatch[1]);

  //   if (year <= 2025) return; // ⬅ skip anything below 2025
  // }



      if (
        lowerHref.includes("malayalam") ||
        lowerHref.includes("mal")
      ) {
        links.add(href);
      }
    });

    // console.log("Filtered Links:\n");
    // [...links].forEach(link => console.log(link));
    // console.log(links)

    console.log(`\nTotal Found: ${links.size}`);
    return links;

  } catch (error) {
    console.error("Error:", error.message);
  }
}

