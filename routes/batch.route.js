import express from "express"
import {createBatch, getAllBatch, getBatchById, updatebatch, deleteBatch} from "../controllers/batch.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.post("/", authenticate, authorize("Admin"), createBatch);
router.get("/", authenticate, getAllBatch);
router.get("/:id", authenticate, getBatchById);
router.put("/:id", authenticate, authorize("Admin"), updatebatch);
router.delete("/:id", authenticate, authorize("Admin"), deleteBatch)
export default router;