import  express from "express";
import register from "../controllers/userController/signup.controller.js";
import login from "../controllers/userController/login.controller.js";
import logout from "../controllers/userController/logout.controller.js";

const router  = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",logout);


export default router;