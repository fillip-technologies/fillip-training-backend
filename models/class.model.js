import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const classSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("CLASS"),
    },
    moduleName: {
        type: String,
        required: [true, "Module name is required"],
    },
    classTime: {
        type: String,
        required: [true, "Class time is required"],
    },
    courseId: {
        type: String,
        required: [true, "CourseId is required"],
    },
    batchId: {
        type: String,
        required: [true, "BatchId is required"],
    },
    instructorId: {
        type: String,
        required: [true, "InstructorId is required"],
    }
}, {timestamps: true});

classSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Class", classSchema)