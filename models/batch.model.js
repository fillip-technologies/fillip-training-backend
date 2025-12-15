import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const batchSchema = new mongoose.Schema ({
    id: {
        type: String,
        default: () => generateUniqueId("BATCH"),
    },
    batchName: {
        type: String,
        required: true,
        unique: true
    },
    courseId: {
        type: String,
        required: true
    },
    instructorId: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        default: ""
    },
    batchTiming: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    classId: {
        type: [String],
        default: []
    },
    endDate: {
        type: Date,
        required: true,
    },
    mode: {
        type: String,
        enum: ["Online", "Offline"],
        required: true,
    },
    status: {
        type: String,
        enum: ["Ongoing", "Will Start"],
        required: true,
    },
    capacity: {
        type: Number,
        required: true
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