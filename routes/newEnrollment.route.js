import express from "express";
import {getAllNewEnrollment, getEnrollmentById, completeEnrollment} from "../controllers/newEnrollment.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.get("/",  getAllNewEnrollment);
router.get("/:id", getEnrollmentById);
router.patch("/complete/:id", completeEnrollment);

export default router