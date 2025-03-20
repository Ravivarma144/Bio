import axios from "axios";
import { db } from "../db/database";
import { config } from "dotenv";

import moment from "moment-timezone";

config();

const PAYROLL_API = process.env.PAYROLL_API!;

/**
 * Function to check internet connectivity
 */
async function isInternetAvailable(): Promise<boolean> {
    try {
        await axios.get("https://www.google.com");
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Sync attendance logs with the payroll system
 */
export async function syncAttendanceLogs() {
    const online = await isInternetAvailable();
    if (!online) {
        console.log("No internet connection. Sync postponed.");
        return;
    }
    try {
        const logs = await db.query("SELECT * FROM attendance WHERE synced = FALSE");

        if (logs.length === 0) {
            console.log("No unsynced logs to sync.");
            return;
        }
        const timeZone = moment.tz.guess();
        await logs.map(async (log: any) => {
            try {
                const response = await axios.post(PAYROLL_API, {
                    employee_id: log.employee_id,
                    punch_time: log.punch_time,
                    punch_type: log.punch_type,
                    device_id: log.device_id,
                    device_type: log.device_type,
                    timeZone: process.env.TZ || timeZone

                });

                if (response.status === 200) {
                    await db.query("UPDATE attendance SET synced = TRUE WHERE id = ?", [log.id]);
                    console.log(`Log ID ${log.id} synced successfully.`);
                }
                return response.status;
            } catch (error) {
                console.error(`Error syncing log ID ${log.id}:`, error);
            }
        })
    } catch (error) {
        console.error("Error retrieving logs from database:", error);
    }
}

export async function updateNotSysnc()
{
    try{
        await db.query("UPDATE attendance SET synced = FALSE ");
    }
    catch(err)
    {
        console.log(err)
    }
}
