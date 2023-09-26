import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORt || 3090;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Replace '*' with your frontend's origin or a specific domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed headers
    credentials: true, // Enable credentials (e.g., cookies, authorization headers)
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.get("/", (req, res) => {
  res.json({ message: "welcome to Auth Mern Server side (API)" });
});

app.listen(port, () => {
  console.log(`Server is running on port:${port} `);
});
