import express from "express";
import {registerUserEmail} from "../controllers/email.controller.js";
const router = express.Router();

router.post("/register", registerUserEmail)

export default router;