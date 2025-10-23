import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRouters.js";
import userRouter from "./routes/userRouters.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    withCredentials: true, //server chấp nhận thông tin xác thực (cookies, authorization headers,)
  })
);
app.use(express.json()); // Giúp server hiểu dữ liệu dạng json
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/auth", userRouter);

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
