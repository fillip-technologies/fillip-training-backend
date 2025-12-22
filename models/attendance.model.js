import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "UserId is required"],
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Leave"],
        required: [true, "Status is required"],
    }
}, {timestamps: true});

attendanceSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);