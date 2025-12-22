import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const newEnrollmentSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("newEnrollment")
    },
    enquiryId: {
        type: String,
        required: [true, "EnquiryId is required for enrollment"]
    },
   name: {
        type: String,
        required: [true, "Name is required"]
   },
   email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },

    phone: {
        type: String,
        default: "",
        trim: true,
        minlength: [10, "Phone number must be at least 10 digits"],
        match: [
            /^[0-9]+$/,
            "Phone number should contain only digits",
        ],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    course: {
        type: String,
        required: [true, "Course is required"]
    },
    enrollmentStatus: {
        type: String,
        enum: ["Pending", "Enrolled"], 
        default: "Pending"
    },
    certificateId: {
        type: String,
        default: ""
    },
    downloadUrl: {
        type: String,
        default: ""
    }
}, {timestamps: true})

export default mongoose.model("NewEnrollment", newEnrollmentSchema);