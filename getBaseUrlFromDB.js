import { initDB } from "./db/db.js";
import { retry } from "./homeassistant/retryWrapper.js";
import { triggerHomeAssistantWebhookWhenErrorOccurs } from "./homeassistant/homeAssistantWebhook.js";

export async function getBaseUrl() {
  const db = await initDB();

try {
    const result = await db.query(
      "SELECT value FROM settings WHERE key = $1",
      ["current_domain"]
    );
} catch (error) {
  console.error('getBaseUrl ',error)
          await retry(
    triggerHomeAssistantWebhookWhenErrorOccurs,
    { status: "error" },
    "homeassistant-error",
    5
  );

  process.exit(1);
}

  if (result.rows.length === 0) {
    throw new Error("Base URL not found in DB");
  }

  return result.rows[0].value;
}
