import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const batchSchema = new mongoose.Schema ({
    id: {
        type: String,
        default: () => generateUniqueId("BATCH"),
    },
    batchName: {
        type: String,
        required: [true, "Batch name is required"],
        unique: [true, "Unique batch name is required"]
    },
    courseId: {
        type: String,
        required: [true, "CourseId is required"]
    },
    instructorId: {
        type: String,
        required: [true, "InstructorId is required"]
    },
    studentId: {
        type: String,
        default: ""
    },
    batchTiming: {
        type: String,
        required: [true, "Batch timing is required"],
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
    classId: {
        type: [String],
        default: []
    },
    mode: {
        type: String,
        enum: ["Online", "Offline"],
        required: [true, "Mode is required"],
    },
    status: {
        type: String,
        enum: ["Ongoing", "Will Start"],
        required: [true, "Status is required"],
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"]
    },
    totalStudent: {
        type: Number,
        default: 0
    },
}, {timestamps: true} )

batchSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Batch", batchSchema);