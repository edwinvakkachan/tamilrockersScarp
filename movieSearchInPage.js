import axios from "axios";
import { load } from "cheerio";


export async function movieSearchInPage(url){

    try {
      const response = await axios.get(url);
      const $ = load(response.data);

      console.log(response.data)
    
      const results = [];
    
      $("a[href$='.html']").each((i, el) => {
        const text = $(el).text().trim();
        const link = $(el).attr("href");
    
        if (
          text.toLowerCase().includes("Rippan Swamy".toLowerCase()) ||
          link.toLowerCase().includes("Rippan Swamy")
        ) {
          results.push(link);
        }
      });
    
      console.log(results);
    
    } catch (err) {
      console.error(err.message);
    }
}
