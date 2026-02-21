import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import AuthRoutes from "../routes/Auth.routes.js";
import UserRoutes from "../routes/User.routes.js";
import { handleError } from "../helpers/handleError.js";
dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});
console.log("🧪 ENV CHECK =", process.env.AI_SERVICE_URL);

const PORT = process.env.PORT || 5000;
const app = express();

/* =========================
   CORS CONFIG (PRODUCTION)
========================= */
const origins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

if (process.env.FRONTEND_URL) {
  origins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);


/* =========================
   MIDDLEWARES
========================= */
app.use(cookieParser());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
========================= */
// app.use("/uploads", express.static(path.resolve("uploads")));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   ROUTES
========================= */
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use(handleError);

/* =========================
   DATABASE CONNECTION
========================= */
mongoose
  .connect(process.env.MONGODB_CONN, {
    dbName: "hack-26-users",
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
