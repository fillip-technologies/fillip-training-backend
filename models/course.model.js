import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";
const courseSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("COURSE"),
    },
    courseCategoryId: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    courseDuration: {
        type: String,
        required: true,
    },
    coursePrice: {
        type: String,
        required: true,
    },
    instructorId: {
      type: String,
      required: true
    },
    batchId: {
        type: [String],
        default: []
    },
    totalEnrollment: {
        type: String,
        default: 0
    },
    courseSyllabus: [
        {
            moduleName: {
                type: String,
                required: true,
            },
            moduleDetails: {
                type: String,
                required: true
            },
        }
    ]
}, {timestamps: true});

courseSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("course", courseSchema);