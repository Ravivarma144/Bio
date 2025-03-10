import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import soapRoutes from "./routes/soap.routes";
import authRoutes from "./routes/auth.routes";
// import configRoutes from "./routes/config.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/soap", soapRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/config", configRoutes);

export default app;
