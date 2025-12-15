import express from "express"
import {createEnquiry, getAllEnquiry, getEnquiryById, updateEnquiry} from "../controllers/enquiry.controller.js"
const router = express.Router()

router.post("/", createEnquiry);
router.get("/", getAllEnquiry);
router.get("/:id", getEnquiryById);
router.put("/:id", updateEnquiry);
// router.put("/:id", updateEnquiry);
// router.delete("/:id", deleteEnquiry);

export default router;