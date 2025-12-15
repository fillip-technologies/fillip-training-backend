import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const certificateSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("CERTIFICATE")
    },
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    certificateURL: {
        type: String,
        required: true
    },
}, {timestamps: true});
certificateSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Certificate", certificateSchema);