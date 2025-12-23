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
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
   email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },

    phone: {
        type: String,
        default: "",
        trim: true,
         maxlength: [10, "Phone number must be 10 digits"],
        match: [
            /^[0-9]+$/,
            "Phone number should contain only digits",
        ],
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },
    location: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: [true, "Role is required"]
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
