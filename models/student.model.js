import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: {
  type: String,
  ref: "User",
  required: [true, "UserId is required"],
  unique: true
},  
enrollmentId: {
  type: [String],
  default: []
},
mode: {
  type: String,
  enum: ["Online", "Offline"],
  default: "Online"
  },
}, {timestamps: true});

studentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Student", studentSchema);