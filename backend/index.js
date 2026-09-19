import express from "express";
import bodyParser from "body-parser";
import connectDb from "./src/config/db.js";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRouter from "./src/routes/message.routes.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);


//all the routers\
app.use("/api/user",userRouter)
app.use("/api/message", messageRouter);

const PORT = 5000;

app.get("/health",(req,res)=>{
    res.status(200).send("Server is healthy");
})

app.listen(PORT, () => {
    connectDb();
  console.log(`Server is running on port ${PORT}`);
});
