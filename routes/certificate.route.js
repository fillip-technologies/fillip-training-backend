import express from "express"
import {downloadCertificate} from "../controllers/certificate.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.get("/:id", authenticate, authorize("Admin", "Student"), downloadCertificate);

export default router