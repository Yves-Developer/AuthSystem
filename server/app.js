import express from "express";
import { connectDB } from "./lib/database/config.js";
import Auth from "./routes/Auth.js"; // Import the router
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", Auth);
app.listen(port || 5000, () => {
  connectDB();
  console.log("Server is running on port:", port);
});
