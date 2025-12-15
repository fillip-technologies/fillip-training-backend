import express from "express";
import {createClass, getAllClasses, getClassById, updateClass, deleteClass} from "../controllers/class.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.post("/", authenticate, authorize("Admin"), createClass);
router.get("/", authenticate, getAllClasses);
router.get("/:id", authenticate, getClassById);
router.put("/:id", authenticate, authorize("Admin"), updateClass);
router.delete("/:id", authenticate, authorize("Admin"), deleteClass);

export default router