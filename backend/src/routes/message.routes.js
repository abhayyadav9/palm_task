import express from "express";
import sendMessage from "../controllers/messageController/sendMessage.controller.js";
import getMessages from "../controllers/messageController/getMessages.controller.js";


const router = express.Router();

router.post("/send", sendMessage);
router.get("/get", getMessages);

export default router;