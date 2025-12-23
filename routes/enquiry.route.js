import express from "express"
import {createEnquiryWithEnrollment, getAllEnquiry, getEnquiryById, updateEnquiry, deleteEnquiry} from "../controllers/enquiry.controller.js"
const router = express.Router()

router.post("/", createEnquiryWithEnrollment);
router.get("/", getAllEnquiry);
router.get("/:id", getEnquiryById);
router.put("/:id", updateEnquiry);
router.delete("/:id", deleteEnquiry);

export default router;