import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import dataRouter from "./routes/data.routes.js";

const app = express();
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-domain.com",
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
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});
app.use(express.json({ limit: "16kb" }));
import path from "path";
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/data", dataRouter);

export { app };
