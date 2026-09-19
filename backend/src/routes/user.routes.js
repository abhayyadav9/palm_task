import express from "express";
import register from "../controllers/authController/signup.controller.js";
import login from "../controllers/authController/login.controller.js";
import logout from "../controllers/authController/logout.controller.js";
import authenticateUser from "../meddleware/authenticateUser.js";
import getAllUsers, { getMe } from "../controllers/userController/getUser.controller.js";
import updateUser from "../controllers/userController/updateUser.controller.js";
import deleteUser from "../controllers/userController/deleteUser.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// User CRUD & stats
router.get("/me", authenticateUser, getMe);
router.get("/users", authenticateUser, getAllUsers);
router.patch("/me", authenticateUser, updateUser);
router.put("/me", authenticateUser, updateUser);
router.delete("/me", authenticateUser, deleteUser);

export default router;