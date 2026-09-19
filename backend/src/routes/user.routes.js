import  express from "express";
import register from "../controllers/authController/signup.controller.js";
import login from "../controllers/authController/login.controller.js";
import logout from "../controllers/authController/logout.controller.js";
import authenticateUser from "../meddleware/authenticateUser.js";
import getAllUsers from "../controllers/userController/getUser.controller.js";

const router  = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);


// gett all users and stats
router.get("/users", authenticateUser, getAllUsers);

export default router;