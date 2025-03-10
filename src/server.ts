import app from "./app";
import "./services/cron.service"; // Import cron jobs

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
