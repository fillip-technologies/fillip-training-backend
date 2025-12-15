import express from "express"
import {updateStudent, getAllStudent, getStudentById, deleteStudent} from "../controllers/student.controller.js"
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.get("/", authenticate, authorize("Admin"), getAllStudent);
router.put("/:userId", authenticate, authorize("Admin", "Student"), updateStudent);
router.get("/:userId", authenticate, authorize("Admin", "Student"), getStudentById);
router.delete("/:userId", authenticate, authorize("Admin"), deleteStudent);

export default router;