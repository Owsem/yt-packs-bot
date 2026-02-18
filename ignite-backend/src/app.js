import express from "express";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Ignite API is running");
});

export default app;

