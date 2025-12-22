import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const enrollmentSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("ENROLLMENT")
    },
    createdBy: {
        type: String,
        required: [true, "CreatedBy is required"]
    },
    courseId: {
        type: String,
        required: [true, "CourseId is required"],
    },
    batchId: {
        type: String,
        required: [true, "BatchId is required"]
    },
    enrollDate: {
        type: Date,
        default: Date.now()
    },
    enrollmentStatus: {
        type: String,
        enum: ["Pending","Enrolled"], 
        default: "Pending"
    },
    courseStatus: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "Pending"
    }
}, {timestamps: true})

enrollmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Enrollment", enrollmentSchema);