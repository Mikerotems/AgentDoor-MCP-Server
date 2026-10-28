import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/connectDB";

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exitCode = 1;
});