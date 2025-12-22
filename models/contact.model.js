import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const contactSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("CONTACT")
    },
    fullName: {
        type: String,
        required: [true, "Full name is required"]
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
    message: {
        type: String,
        required: [true, "Message is required"]
    },
}, {timestamps: true})

export default mongoose.model("Contact", contactSchema)