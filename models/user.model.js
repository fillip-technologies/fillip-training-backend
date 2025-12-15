import mongoose from "mongoose";
import generateUniqueId from "../utils/generateUniqueIdGenerator.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => generateUniqueId("USER"),
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
    },
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
    {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
    //    return next(error)
    console.error(error)
    }
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

export default mongoose.model("User", userSchema);
