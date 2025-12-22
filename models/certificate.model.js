import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const certificateSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("CERTIFICATE")
    },
    // userId: {
    //     type: String,
    //     required: true
    // },
    // courseId: {
    //     type: String,
    //     required: true
    // },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    course: {
        type: String,
        required: [true, "Course is required"]
    },
    issueDate: {
        type: Date,
        required: [true, "Issue date is required"]
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