import { extractPage } from "./extractMagnetLink/extractMagnetLink.js";
// import { movieSearchInPage } from "./movieSearchInPage.js";
import { scrapeMalayalamLinks } from "./extractHomePage.js";
import { addToTorrent} from "./addTOTorrent.js";
import { checkDomain } from "./domainTracker.js";
import { delay } from "./delay.js";
import { sendMessage } from "./telegram/sendTelegramMessage.js";
// import { cleanupTodayTorrents } from "./qbittorrent/torrentCleanUp.js";
import { moveTorrentToTop } from "./qbittorrent/qb.js";





async function main() {
  try {
    console.log("tamilrockers scraping Process started");
    await sendMessage('tamilrockers scraping Process started')
   await delay(1000,true)
   await checkDomain();

   await delay(5000)

    const links = await scrapeMalayalamLinks();

    if (!links || links.length === 0) {
      console.log("No links found.");
      await sendMessage("No links found.")
      await delay(1000,true)
      return;
    }

    console.log(`Found ${links.length} links`);
    await delay(5000);
    for (const value of links) {
      try {
        await delay(2000)
        await extractPage(value);
      } catch (err) {
        console.error(`Error processing link: ${value}`);
        console.error(err.message);
        await sendMessage("❌ Error processing link ")
        await delay(1000,true)
      }
    }
   await delay(5000);
    await addToTorrent();
    await delay(30000);
    await moveTorrentToTop();
    await delay(5000)

    console.log("Process completed saved the links in db successfully");
    await sendMessage("tamilROckers scrapping Process completed and links are saved in DB successfully")
  } catch (error) {
    console.error("Fatal error in main():");
    console.error(error);
    await sendMessage("❌  Fatal error in main():")
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });