import express from "express";
import {markAttendance, getAllAttendance, getAttendanceById} from "../controllers/attendance.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.post("/", authenticate, markAttendance);
router.get("/", authenticate, authorize("Admin"), getAllAttendance);
router.get("/:userId", authenticate, getAttendanceById)

export default router;