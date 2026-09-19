import express from "express";
import sendMessage from "../controllers/messageController/sendMessage.controller.js";
import getMessages from "../controllers/messageController/getMessages.controller.js";
import authenticateUser from "../meddleware/authenticateUser.js";


const router = express.Router();

router.post("/send", authenticateUser, sendMessage);
router.get("/get", authenticateUser, getMessages);

export default router;