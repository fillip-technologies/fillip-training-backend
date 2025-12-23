import express from "express";
import {createContact, getAllContact, updateContact, deleteContact} from "../controllers/contact.controller.js";
import { authenticate, authorize } from "../middlewares/authenticate.middleware.js";

const router = express.Router()

router.post("/", createContact);
router.get("/", authenticate, authorize("Admin"), getAllContact);
router.put("/:id", authenticate, authorize("Admin"), updateContact);
router.delete("/:id", deleteContact);

export default router