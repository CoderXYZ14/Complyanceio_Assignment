import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import dataRouter from "./routes/data.routes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-domain.vercel.app", // Replace with your actual Vercel frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/data", dataRouter);

// Catch-all middleware for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export { app };
