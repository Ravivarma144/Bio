import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import soapRoutes from "./routes/soap.routes";
import authRoutes from "./routes/auth.routes";
import attendanceRoutes from "./routes/attendance";
import syncRoutes from "./routes/sync";
// import configRoutes from "./routes/config.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/soap", soapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api", syncRoutes);
// app.use("/api/config", configRoutes);

// ✅ Global Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("❌ Uncaught Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// ✅ Prevent Crashes on Unhandled Errors
process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
});

export default app;
