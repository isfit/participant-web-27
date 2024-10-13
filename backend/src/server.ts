import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "./routes/user";
import auth from "./routes/auth";
import cookieParser from "cookie-parser";
import application from "./routes/application";

dotenv.config();

const app: Express = express();

// CORS settings
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";

// MongoDB connection options
const options = {
  socketTimeoutMS: 180000,
  connectTimeoutMS: 180000,
  serverSelectionTimeoutMS: 180000,
  maxPoolSize: 50,
};

(async () => {
  try {
    await mongoose.connect(uri, options);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();

// Routes
app.use("/auth", auth);
app.use("/api", user);
app.use("/api/application", application);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

// Health check logs every minute
const PORT: string | number = process.env.PORT || 4000;
setInterval(() => {
  console.log("Server health check. Server is running on port:" + PORT);
}, 60000);

app.use((err: any, _req: Request, res: Response, next: Function) => {
  if (err.code && err.code === 11000) {
    console.error("Duplicate key error:", err.message);
    return res.status(400).json({ error: "Duplicate key error", message: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
