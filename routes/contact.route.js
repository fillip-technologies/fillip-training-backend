import express from "express";
import {createContact, getAllContact, updateContact} from "../controllers/contact.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";

const router = express.Router()

router.post("/", createContact);
router.get("/", authenticate, authorize("Admin"), getAllContact);
router.put("/:id", authenticate, authorize("Admin"), updateContact);

export default router