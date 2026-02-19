import { extractPage } from "./extractMagnetLink/extractMagnetLink.js";
// import { movieSearchInPage } from "./movieSearchInPage.js";
import { scrapeMalayalamLinks } from "./extractHomePage.js";
import { addToTorrent } from "./addTOTorrent.js";
import { checkDomain } from "./domainTracker.js";
import { delay } from "./delay.js";
import { sendMessage } from "./telegram/sendTelegramMessage.js";
import { cleanupTodayTorrents } from "./qbittorrent/torrentCleanUp.js";

async function main() {
  try {
    console.log("tamilrockers scraping Process started");
    await sendMessage('tamilrockers scraping Process started')

   await sendMessage('domain checking started')
   await checkDomain();

   await delay(5000)

    const links = await scrapeMalayalamLinks();

    if (!links || links.length === 0) {
      console.log("No links found.");
      await sendMessage("No links found.")
      return;
    }

    console.log(`Found ${links.length} links`);

    for (const value of links) {
      try {
        await extractPage(value);
      } catch (err) {
        console.error(`Error processing link: ${value}`);
        console.error(err.message);
        await sendMessage(err.message)
      }
    }

    await addToTorrent();
    await delay(30000);
    await cleanupTodayTorrents();

    console.log("Process completed successfully");
    await sendMessage("tamilROckers scrapping Process completed successfully")
  } catch (error) {
    console.error("Fatal error in main():");
    console.error(error);
    await sendMessage(error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });