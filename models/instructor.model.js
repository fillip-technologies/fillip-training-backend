import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
  userId: {
  type: String,
  ref: "User",
  required: [true, "UserId is required"],
  unique: true
  },
    specialization: {
        type: String,
        default: ""
    },
    courseId: {
        type: [String],
        default: [], 
      },
    batchId: {
          type: [String],
          default: [], 
        },
    classId: {
            type: [String],
           default: []
        },

}, {timestamps: true});

instructorSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Instructor", instructorSchema)