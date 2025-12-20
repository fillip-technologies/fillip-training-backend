import express from "express";
import {createNewEnrollment, getAllNewEnrollment, getEnrollmentById, completeEnrollment} from "../controllers/newEnrollment.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.post("/",  createNewEnrollment);
router.get("/",  getAllNewEnrollment);
router.get("/:id", getEnrollmentById);
router.patch("/complete/:id", completeEnrollment);

export default router