import app from "./app";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./DB/db.cofig";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(); // connect Prisma
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received: shutting down gracefully");
  await disconnectDB();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received: shutting down gracefully");
  await disconnectDB();
  process.exit(0);
});

startServer();
