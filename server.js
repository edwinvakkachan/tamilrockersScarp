import { extractPage } from "./extractMagnetLink/extractMagnetLink.js";
// import { movieSearchInPage } from "./movieSearchInPage.js";
import { scrapeMalayalamLinks } from "./extractHomePage.js";
import { addToTorrent} from "./addTOTorrent.js";
import { checkDomain } from "./domainTracker.js";
import { delay } from "./delay.js";
import { sendMessage } from "./telegram/sendTelegramMessage.js";
// import { cleanupTodayTorrents } from "./qbittorrent/torrentCleanUp.js";
// import { moveTorrentToTop } from "./qbittorrent/qb.js";
import { triggerHomeAssistantWebhook } from "./homeassistant/homeAssistantWebhook.js";
import { insertLinkIfNew } from "./db/db.js";
import { log } from "./timelog.js";




async function main() {
  try {
    
    await sendMessage('🥭🥭🥭🥭🥭🥭🥭🥭🥭');
    console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭');
    console.log("🚀  tamilrockers scraping Process started");
    await sendMessage('🚀  tamilrockers scraping Process started')
    await log();

   await checkDomain();

   await delay(5000)

    const links = await scrapeMalayalamLinks();

    if (!links || links.size === 0) {
      console.log("💥 No links found.");
      await sendMessage("💥 No links found.")
      await delay(1000,true)
      return;
    }

    await delay(5000);
    
    console.log(`it will take 5 minutes to complete`);



    for (const value of links) {
  try {
    const isNew = await insertLinkIfNew(value);

    if (!isNew) {
      // console.log("⏩ Skipping already processed:", value);
      continue;
    }

    console.log("🆕 New link:", value);

    await extractPage(value);

  } catch (err) {
    console.error(`Error processing link: ${value}`);
    console.error(err.message);
    await sendMessage("❌ Error processing link ");
    await delay(1000, true);
  }
}


   await delay(5000);
    await addToTorrent();

    await delay(5000)

    console.log("🆗 Process completed and links are saved in db and added inside the torrent");
    await sendMessage("🆗 tamilROckers scrapping Process completed and links are saved in DB and added to torrent successfully")
  
await triggerHomeAssistantWebhook({
  status: "success",
  message: "Torrent cleaning completed",
  time: new Date().toISOString(),
});
     await log();
    console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭')
  await sendMessage('🥭🥭🥭🥭🥭🥭🥭🥭🥭')
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