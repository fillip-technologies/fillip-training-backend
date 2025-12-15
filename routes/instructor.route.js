import express from "express"
import {getAllInstructor, updateInstructor, getInstructorById, deleteInstructor} from "../controllers/instructor.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.get("/", authenticate, authorize("Admin"), getAllInstructor);
router.put("/:userId", authenticate, authorize("Admin", "Instructor"), updateInstructor);
router.get("/:userId", authenticate, authorize("Admin", "Instructor"), getInstructorById);
router.delete("/:userId", authenticate, authorize("Admin"), deleteInstructor);

export default router;