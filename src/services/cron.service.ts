import cron from "node-cron";
import axios from "axios";
import { convertSoapToJson } from "./soap.service";

console.log("🕒 Cron jobs initialized...");

// Schedule a cron job to run every 5 minutes
cron.schedule("*/2 * * * *", async () => {
  console.log("🕒 Running scheduled SOAP XML conversion...");

const url = "http://192.168.0.102:86/iclock/webapiservice.asmx?op=GetTransactionsLog";

  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetTransactionsLog xmlns="http://tempuri.org/">
        <FromDateTime>2025-3-1 00:00</FromDateTime>
        <ToDateTime>2025-3-10 23:59</ToDateTime>
        <SerialNumber>JNP2244801868</SerialNumber>
        <UserName>API</UserName>
        <UserPassword>Api@12345</UserPassword>
        <strDataList>string</strDataList>
      </GetTransactionsLog>
    </soap:Body>
  </soap:Envelope>`;

  try {
    const response = await axios.post(url, soapRequest, {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://tempuri.org/GetTransactionsLog", // SOAPAction might be required
      },
      timeout: 10000, // Timeout after 10 seconds
    });
    const jsonResponse = await convertSoapToJson(response.data||'');
    console.log("✅ SOAP Conversion Result:", JSON.stringify(jsonResponse));
  } catch (error) {
    console.error("❌ SOAP Conversion Failed:", error);
  }
});

// Another cron job: Runs every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("🌙 Midnight task: Cleaning expired tokens...");
  // Implement logic for clearing expired tokens, database cleanup, etc.
});
