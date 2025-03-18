import axios from "axios";
import { parseStringPromise } from "xml2js";
import { db } from "../db/database";
import { config } from "dotenv";
import moment from "moment-timezone";

config();
export async function fetchAttendanceLogs() {
  try {
    let DevicesList:any=[];
    // Get multiple device IDs from `.env` and split into an array
    const DEVICE_IDS = (process.env.ICLOCK_SERIAL_NUMBER || "")
      .split(",")
      .map((id) => {return {id: id.trim(), device_type : 'CHECK_IN'}});

    const OUT_DEVICE_IDS = (process.env.ICLOCK_OUT_SERIAL_NUMBER || "")
      .split(",")
      .map((id) => { return {id: id.trim(), device_type : 'CHECK_OUT'} });
    console.log(DEVICE_IDS,OUT_DEVICE_IDS)

    if(DEVICE_IDS && DEVICE_IDS.length)
    {
      DevicesList= [...DevicesList , ...DEVICE_IDS];
    }

    if(OUT_DEVICE_IDS && OUT_DEVICE_IDS.length)
      {
        DevicesList= [...DevicesList, ...OUT_DEVICE_IDS];
      }

    // Get time gap from env (default: 10 minutes)
    const TIME_GAP_MINUTES = parseInt(process.env.TIME_GAP_MINUTES || "10", 10);

    // Get the current time (ToDateTime)
    const timeZone = moment.tz.guess();
    const currentTime = moment().tz(process.env.TZ || timeZone);
    // Subtract 10 minutes by default setting
    const timeMinusByConfig = currentTime.clone().subtract(TIME_GAP_MINUTES, "minutes");
    // <FromDateTime>2025-03-01 00:01</FromDateTime>
    //   <ToDateTime>2025-03-17 23:59</ToDateTime>
    

    // <FromDateTime>2025-03-01 00:01</FromDateTime>
    // <ToDateTime>2025-03-20 23:59</ToDateTime>

    await DevicesList.map(async (device:any) => {
      const soapRequest = `<?xml version="1.0"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetTransactionsLog xmlns="http://tempuri.org/">
      <SerialNumber>${device.id}</SerialNumber>
    <FromDateTime>${timeMinusByConfig.format("YYYY-MM-DD HH:mm")} </FromDateTime>
    <ToDateTime>${currentTime.format("YYYY-MM-DD HH:mm")}</ToDateTime>
      <UserName>${process.env.ICLOCK_USER}</UserName>
      <UserPassword>${process.env.ICLOCK_PASSWORD}</UserPassword>
      <strDataList>string</strDataList>
    </GetTransactionsLog>
  </soap:Body>
</soap:Envelope>`;

      const response = await axios.post(process.env.ICLOCK_URL!, soapRequest, {
        headers: {
          "Content-Type": "text/xml",
          SOAPAction: "http://tempuri.org/GetTransactionsLog",
        },
      });

      const parsed = await parseStringPromise(response.data, {
        explicitArray: false,
      });
      const logs =
        parsed["soap:Envelope"]["soap:Body"]["GetTransactionsLogResponse"];
      const logsCount = logs["GetTransactionsLogResult"];
      const strDataList = logs["strDataList"];


      if (!strDataList) {
        throw new Error("No transaction data found");
        return;
      }

      // Ensure proper extraction of ID and timestamp
      const transactions = strDataList
        .trim()
        .split("\n")
        .map((line: any) => {
          const parts = line.trim().split(/\s+/);
          const id = parseInt(parts[0], 10) || '';
          const timestamp = `${parts[1] || ''} ${parts[2] || ''}`; // Ensure full date-time format
          return { id, timestamp };
        });

      await transactions.map(async (data: any) => {
        if (data?.id && data?.timestamp) {
          await db.query(
            "INSERT INTO attendance (device_id ,device_type,employee_id, punch_time, punch_type, synced) VALUES (?,?,?, ?, ?, FALSE)",
            [device.id, device.device_type, data.id, data.timestamp, "VS_FP"]
          );
        }
      });
      return '';
    })
    return { message: "Records Proceed to Store", status: true };
  } catch (error: any) {
    console.error("Error fetching logs:", error);
    return { message: error.message, status: false };
  }
}
