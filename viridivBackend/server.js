import express from "express";
import dns from "dns";

// Set DNS servers to Google's to bypass ISP blocking of SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToDB from "./db/connectToDb.js";
import offerListRouter from "./routes/offerList.routes.js";
import authRouter from "./routes/auth.routes.js";
import notificationRouter from "./routes/notifications.routes.js";
import orderRouter from "./routes/order.routes.js";
import dataRouter from "./routes/dataDownload.routes.js";
import userRouter from "./routes/user.routes.js";
import invoiceRouter from "./routes/invoice.routes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:5175",
      "https://cheery-douhua-aa70cb.netlify.app",
      "https://jade-cat-fbc9b6.netlify.app",
      "https://calm-biscochitos-0c52fb.netlify.app",
      "https://viridiv.com",
      "https://www.viridiv.com",
      "https://dashboard.viridiv.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.use("/api/offer-list", offerListRouter);
app.use("/api/auth", authRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/order", orderRouter);
app.use("/api/data", dataRouter);
app.use("/api/user", userRouter);
app.use("/api/invoice", invoiceRouter);

app.get("/", (req, res) => {
  res.send("server working correctly");
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`App listening at http://localhost:${PORT}`);
});
