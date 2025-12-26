// backend/index.js
// Question: Express server with correct CORS for Render + Vercel

import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import { socketHandler } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

/* ===================== CORS CONFIG ===================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://food-delivery-vingo-ohlu.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

/* ===================== MIDDLEWARES ===================== */
app.use(express.json());
app.use(cookieParser());

/* ===================== SOCKET.IO ===================== */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io);

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.status(200).send("Vingo Backend is running 🚀");
});

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

/* ===================== SOCKET HANDLER ===================== */
socketHandler(io);

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 8000;

server.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.log("❌ DB connection failed", error);
  }
});
