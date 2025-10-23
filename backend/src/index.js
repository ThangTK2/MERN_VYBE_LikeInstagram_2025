import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.get("/", (req, res) => {
  res.send("jiii");
});

// Kết nối DB và khởi động server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server bắt đầu ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error("Kết nối DB thất bại", error);
  });
