import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";


const enquirySchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("ENQ"),
    },
    name: {
        type: String,
        required: [true, "Name is required"],
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
    college: {
        type: String,
        required: [true, "College is required"],
    },
    course: {
        type: String,
        required: [true, "Course is required"]
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Enquiry Pending", "Enquiry Completed"],
        default: "Enquiry Pending"
    },
    remark: {
        type: String,
        default: ""
    }
}, {timestamps: true});

enquirySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
export default mongoose.model("Enquiry", enquirySchema);