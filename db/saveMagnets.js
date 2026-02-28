import { initDB } from "./db.js";
import { delay } from "../delay.js";

import { triggerHomeAssistantWebhookWhenErrorOccurs } from "../homeassistant/homeAssistantWebhook.js";
import { retry } from "../homeassistant/retryWrapper.js";
export async function saveMagnets(magnetLinks) {
  const db = await initDB();

  for (const magnet of magnetLinks) {
    try {
      await db.query(
        `INSERT INTO magnets (magnet)
         VALUES ($1)
         ON CONFLICT (magnet) DO NOTHING`,
        [magnet]
      );
    } catch (error) {
        console.error("DB saveMagnets:", err.message);
            await retry(
    triggerHomeAssistantWebhookWhenErrorOccurs,
    { status: "error" },
    "homeassistant-error",
    5
  );

    }

    await delay(300,true);
  }
}
