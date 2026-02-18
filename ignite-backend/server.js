import dotenv from "dotenv";
dotenv.config();

import http from "http";
import connectDB from "./src/database/connect.js";
import "./src/bot.js"; // just importing starts the bot

const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Bot is running");
    });

    server.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
