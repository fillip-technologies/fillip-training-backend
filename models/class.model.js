import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const classSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("CLASS"),
    },
    moduleName: {
        type: String,
        required: true,
    },
    classTime: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true
    },
    batchId: {
        type: String,
        required: true,
    },
    instructorId: {
        type: String,
        required: true
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