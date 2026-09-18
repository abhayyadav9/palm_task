import express from "express";
import bodyParser from "body-parser";
import connectDb from "./src/config/db.js";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.json());

app.use(cookieParser());

dotenv.config();


//all the routers\
app.use("/api/user",userRouter)

const PORT = 5000;

app.get("/health",(req,res)=>{
    res.status(200).send("Server is healthy");
})

app.listen(PORT, () => {
    connectDb();
  console.log(`Server is running on port ${PORT}`);
});
