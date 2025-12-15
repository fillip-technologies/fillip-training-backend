import express from "express"
import {registerUser, loginUser, logoutuser} from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutuser);

export default router;