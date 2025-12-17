import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const newEnrollmentSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("newEnrollment")
    },
   name: {
        type: String,
        required: true
   },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true
    },
    enrollmentStatus: {
        type: String,
        enum: ["Pending", "Enrolled"], 
        default: "Pending"

    }
}, {timestamps: true})

export default mongoose.model("NewEnrollment", newEnrollmentSchema);