import { extractPage } from "./extractMagnetLink/extractMagnetLink.js";
import { scrapeMalayalamLinks } from "./extractHomePage.js";
import { addToTorrent} from "./addTOTorrent.js";
import { checkDomain } from "./domainTracker.js";
import { delay } from "./delay.js";
import { triggerHomeAssistantWebhook,triggerHomeAssistantWebhookWhenErrorOccurs } from "./homeassistant/homeAssistantWebhook.js";
import { insertLinkIfNew } from "./db/db.js";
import { log } from "./timelog.js";
import { retry } from "./homeassistant/retryWrapper.js";
import { publishMessage } from "./queue/publishMessage.js";




async function main() {
  try {

await log();
    console.log("🚀  tamilrockers scraping Process started");
           
    await publishMessage({
  message: "🚀  tamilrockers scraping Process started"
});
    

   await checkDomain();

   await delay(5000)

    const links = await scrapeMalayalamLinks();

    if (!links || links.size === 0) {
      console.log("💥 No links found.");
              await publishMessage({
  message: "💥 No links found."
});
      await delay(1000,true)
      return;
    }

    await delay(5000);
    
    console.log(`it will take 5 minutes to complete `);



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
            await publishMessage({
  message: "❌ Error processing link "
});
    await delay(1000, true);
  }
}


   await delay(5000);
    await addToTorrent();

    await delay(5000)

    console.log("🆗 Process completed and links are saved in db and added inside the torrent");
  
    await retry(
  triggerHomeAssistantWebhook,
  { status: "success" },
  "homeassistant-success",
  5
);

     await log();
    console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭')
            await publishMessage({
  message: "🥭🥭🥭🥭🥭🥭🥭🥭🥭"
});
            await publishMessage({
  message: 'tramil rockers scraping completed successfully 💯'
});
  } catch (error) {
    console.error("Fatal error in main():");
    console.error(error);

            await publishMessage({
  message: "❌  Fatal error in main():"
});

      await retry(
  triggerHomeAssistantWebhookWhenErrorOccurs,
  { status: "error" },
  "homeassistant-error",
  5
);

  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });