import express from "express"
import {addEnrollment, getAllEnrollment, completeCourse, getEnrollmentById, updateEnrollment, deleteEnrollment} from "../controllers/enrollment.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.post("/", authenticate, authorize("Admin", "Student"), addEnrollment);
router.get("/", authenticate, authorize("Admin"), getAllEnrollment);
router.put("/completeCourse/:id", authenticate, authorize("Student"), completeCourse);
router.get("/:id", authenticate, authorize("Admin", "Student"), getEnrollmentById);
router.put("/:id", authenticate, authorize("Admin", "Student"), updateEnrollment);
router.delete("/:id", authenticate, authorize("Admin"), deleteEnrollment);

export default router