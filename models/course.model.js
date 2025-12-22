import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";
const courseSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("COURSE"),
    },
    courseCategoryId: {
        type: String,
        required: [true, "Course category name is required"],
    },
    courseName: {
        type: String,
        required: [true, "Course name is required"],
    },
    courseDuration: {
        type: String,
        required: [true, "Course duration is required"],
    },
    coursePrice: {
        type: String,
        required: [true, "Course price is required"],
    },
    instructorId: {
      type: String,
      required: [true, "InstructorId is required"]
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
                required: [true, "Module Name is required"],
            },
            moduleDetails: {
                type: String,
                required: [true, "Module details is required"]
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