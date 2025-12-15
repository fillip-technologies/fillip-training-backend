import express from "express"
import {addCourse, getAllCourses, getCourseById, updateCourse, deleteCourse} from "../controllers/course.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.post("/", authenticate, authorize("Admin"), addCourse);
router.get("/", authenticate, getAllCourses);
router.get("/:id", authenticate, getCourseById);
router.put("/:id", authenticate, authorize("Admin"), updateCourse);
router.delete("/:id", authenticate, authorize("Admin"), deleteCourse);


export default router;