import express from "express";
import bodyParser from "body-parser";
import connectDb from "./src/config/db.js";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRouter from "./src/routes/message.routes.js";
import http from "http";
import socketServer from "./socket/socket.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// All routers
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: true, message: "Server is healthy" });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

socketServer(server);

server.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});

