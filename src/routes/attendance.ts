import { Router } from "express";
import { fetchAttendanceLogs } from "../services/fetchLogs";
import { db } from "../db/database";  // ✅ Import db instance

const router = Router();

/**
 * API to get all attendance logs
 */
router.get("/logs", async (req, res) => {
    try {
        console.log("Logs fetching called")
        const logs = await db.query("SELECT * FROM attendance");  // ✅ Ensure db is accessible
        res.json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * API to manually trigger log fetching
 */
router.post("/fetch", async (req, res) => {
    try {
        await fetchAttendanceLogs();
        res.json({ message: "Attendance logs fetched successfully" });
    } catch (error) {
        console.error("Error fetching attendance logs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
