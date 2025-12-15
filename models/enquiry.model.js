import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";


const enquirySchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("ENQ"),
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    phone: {
        type: String,
        required: true,

    }, 
    location: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true
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