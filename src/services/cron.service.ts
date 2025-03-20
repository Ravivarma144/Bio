import cron from "node-cron";
import axios from "axios";
import { convertSoapToJson } from "./soap.service";
import { fetchAttendanceLogs } from "./fetchLogs";
import { syncAttendanceLogs } from "./syncLogs";

console.log("🕒 Cron jobs initialized...");

const timeInterval= process.env.TIME_GAP_MINUTES || 10;

// Schedule a cron job to run every 5 minutes
cron.schedule(`*/${timeInterval} * * * *`, async () => {
  console.log(`🕒 Running Fetching Last  ${timeInterval} Bio Logs from devices `);
  try {
    await Promise.all([fetchAttendanceLogs(), syncAttendanceLogs()]);
    console.log(`✅  Last  ${timeInterval} Bio Logs Synced with database.When we internet connection estabished it will trigger to live servers `);
  } catch (error) {
    console.error("❌ SOAP Conversion Failed:", error);
  }
});

// Another cron job: Runs every day at midnight
// cron.schedule("0 0 * * *", () => {
//   console.log("🌙 Midnight task: Cleaning expired tokens...");
//   // Implement logic for clearing expired tokens, database cleanup, etc.
// });
