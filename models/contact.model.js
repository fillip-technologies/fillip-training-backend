import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const contactSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("CONTACT")
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        required: true
    },
}, {timestamps: true})

export default mongoose.model("Contact", contactSchema)