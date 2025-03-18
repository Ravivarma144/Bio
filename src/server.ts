import app from "./app";
// import "./services/cron.service"; // Import cron jobs
import { connectDatabase } from "./db/database";

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// connectDatabase().then(() => {
//   app.listen(PORT, () => console.log("Server running on port "+PORT));
// });

// ✅ Ensure Database Connection Before Starting Server
connectDatabase().then(() => {
  app.listen(PORT, () => console.log("🚀 Server running on port "+PORT));
}).catch((error) => {
  console.error("❌ Database connection failed:", error);
  process.exit(1); // Exit if database fails
});
