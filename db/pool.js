import pkg from "pg";
const { Pool } = pkg;
import { retry } from "../homeassistant/retryWrapper";
import { triggerHomeAssistantWebhookWhenErrorOccurs } from "../homeassistant/homeAssistantWebhook";

try {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} catch (error) {
  console.error("supabase db  insert failed:", err.message);
       await retry(
    triggerHomeAssistantWebhookWhenErrorOccurs,
    { status: "error" },
    "homeassistant-error",
    5
  );
}

export default pool;