import axios from "axios";
import { delay } from "../delay.js";
import { sendMessage } from "../telegram/sendTelegramMessage.js";

const HA_WEBHOOK_URL = process.env.HA_WEBHOOK_URL;
const HA_WEBHOOKERROR_URL = process.env.HA_WEBHOOKERROR_URL;  
// Example: http://192.168.0.50:8123/api/webhook/your_webhook_id

export async function triggerHomeAssistantWebhook() {
  try {
    if (!HA_WEBHOOK_URL) {
      console.warn("⚠️ HA_WEBHOOK_URL not set in .env");
      return;
    }

    const response = await axios.post(HA_WEBHOOK_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    await delay(10000,true);
    console.log("✅ Home Assistant webhook triggered: for next app", response.status);
    return;
  } catch (error) {
    console.error("❌ Failed to trigger Home Assistant webhook for next app");
    await sendMessage("❌ Failed to trigger Home Assistant webhook for next app")
    console.error(error.message);
  }
}

export async function triggerHomeAssistantWebhookWhenErrorOccurs(payload = {}) {
  try {
    if (!HA_WEBHOOKERROR_URL) {
      console.warn("⚠️ HA_WEBHOOKERROR_URL not set in .env");
      return;
    }

    const response = await axios.post(HA_WEBHOOKERROR_URL,{
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
    await delay(10000,true);
    console.log("✅ app failed webhook triggered for running again:", response.status);
    return ;
  } catch (error) {
    console.error("❌ Failed to trigger Home Assistant webhook for running again:");
    await sendMessage("❌ Failed to trigger Home Assistant webhook for running again:")
    console.error(error.message);
  }
}