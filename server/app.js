import express from "express";
import { connectDB } from "./lib/database/config.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
const app = express();
app.get("/", async (req, res) => {
  res.send("hello");
});
app.listen(port || 5000, () => {
  connectDB();
  console.log("Server is running on port:", port);
});
