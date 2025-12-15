import express from "express"
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js"
import {createCourseCategory, getAllCourseCategory, updateCourseCategory, deleteCourseCategory} from "../controllers/courseCategory.controller.js"
const router = express.Router()

router.post("/", authenticate, authorize("Admin"), createCourseCategory);
router.get("/", authenticate, authorize("Admin"), getAllCourseCategory);
router.put("/:id",authenticate, authorize("Admin"), updateCourseCategory);
router.delete("/:id", authenticate, authorize("Admin"), deleteCourseCategory);

export default router