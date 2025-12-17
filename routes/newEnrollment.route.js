import express from "express";
import {createNewEnrollment, getAllNewEnrollment, getEnrollmentById, updateNewEnrollment} from "../controllers/newEnrollment.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.post("/", authenticate, authorize("Admin"), createNewEnrollment);
router.get("/", authenticate, authorize("Admin"), getAllNewEnrollment);
router.get("/:id", authenticate, authorize("Admin"), getEnrollmentById);
router.put("/:id", authenticate, authorize("Admin"), updateNewEnrollment);

export default router