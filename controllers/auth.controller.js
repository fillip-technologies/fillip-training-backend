import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Instructor from "../models/instructor.model.js";
import Student from "../models/student.model.js";

export const registerUser = async(req, res) => {
    try {
        const data = req.body;
        const isAdmin = await User.findOne({role: data.role});
        if(isAdmin)
        {
            return res.status(409).json({message: "No more admin allowed", success: false})
        }
        const existingUser = await User.findOne({ email: data.email})
        if(existingUser)
        {
            return res.status(409).json({
                message: "User Already Exists",
                success: false,
            })
        }
        const newUser = new User(data);
        await newUser.save()

        if (data.role === "Instructor") {
            await Instructor.create({ userId: newUser.id });
        }

        if (data.role === "Student") {
            await Student.create({ userId: newUser.id });
        }
       
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            data: newUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
}

export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user)
        {
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }
        const isMatch = await bcrypt.compare(password, user.password,)
        if(!isMatch)
        {
            return res.status(400).json({
                message: "Inavlid crenditals",
                success: false,
            })
        }
        const token = jwt.sign({id: user.id, role: user.role}, process.env.SECRET_KEY, {expiresIn: '9h'});
         const isProduction = process.env.NODE_ENV === "production";

       res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 9 * 60 * 60 * 1000,
        }).status(200).json({
                message: "User logged in successfully",
                success: true,
                data: {
                    user, 
                    token,
                }
            }); 
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}


export const logoutuser = async(req, res) => {
    try {
        return res.clearCookie("token").status(200).json({
            message: "User logged out successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        }) 
    }
}
