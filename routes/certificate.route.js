import express from "express"
import {downloadCertificate} from "../controllers/certificate.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";
const router = express.Router()

router.get("/download/:id", downloadCertificate);

export default router