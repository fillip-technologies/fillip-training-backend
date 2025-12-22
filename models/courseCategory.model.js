import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

const courseCategory = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("Course-Category")
    },
    name: {
        type: String,
        unique: true,
        required: [true, "Category Name is required"]
    },
}, {timestamps: true});

courseCategory.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("CourseCategory", courseCategory)