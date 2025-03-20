import { Router } from "express";
import { syncAttendanceLogs, updateNotSysnc } from "../services/syncLogs";

const router = Router();

/**
 * Manually trigger the sync process
 */
router.post("/sync", async (req, res) => {
    await syncAttendanceLogs();
    res.json({ message: "Sync process triggered successfully." });
});
router.get("/",async (req,res)=>{
    await updateNotSysnc();
    res.json({ message: "Sync process triggered successfully." });
})
export default router;
