import Attendance from "../models/attendance.model.js";
import User from "../models/user.model.js";

export const markAttendance = async(req, res) => {
    try {
        const {status} = req.body;
        const user = await User.findOne({id: req.user.id})
        if(!user)
        {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const alreadyMarked = await Attendance.findOne({userId: user.id , date: today});
        if(alreadyMarked)
        {
            return res.status(400).json({
                message: "Attendance already marked for today",
                success: false,
            });
        }
        const attendance = new Attendance({
            userId: user.id,
            date: today,
            status
        })
        await attendance.save();
        return res.status(200).json({
            message: "Attendance marked successfully",
            success: true,
            data: attendance,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
        
    }
}

export const getAllAttendance = async(req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const pipeline = [
            {$sort: {createdAt: -1}},
            { 
                $lookup: {
                    from: "users", 
                    localField: "userId",
                    foreignField: "id", 
                    as: "userData",
                },
            },
        ]
        if(limitNum > 0)
        {
            pipeline.push({$skip: (pageNum - 1) * limitNum});
            pipeline.push({$limit: limitNum});
        }

        pipeline.push({
            $project: {
                _id: 0,
                id: 1,
                userId: 1,
                userName: {
                    $concat: [{ $arrayElemAt: ["$userData.firstName", 0] }," ",{ $arrayElemAt: ["$userData.lastName", 0] }]
                },
                date: 1,
                status: 1
            }
        })

       const attendance = await Attendance.aggregate(pipeline);
       const totalAttendance = await Attendance.countDocuments();

       if(attendance.length === 0)
       {
        return res.status(200).json({
            message: "No data Found",
            success: false,
            data: [],
            totalAttendance: 0,
            currentPage: pageNum,
            totalPage: 0,  
        });
    } 
   return res.status(200).json({
            message: "All Attendence fetched successfully",
            success: false,
            data: attendance,
            totalAttendance: totalAttendance,
            currentPage: pageNum,
            totalPage: limitNum > 0 ? Math.ceil(totalAttendance / limitNum) : 1,  
        }); 
}
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
}

export const getAttendanceById = async(req, res) => {
    try {
        const {userId} = req.params;
        const attendancedata = await Attendance.findOne({userId})
        if(!attendancedata)
        {
            return res.status(404).json({
                message: "Attendance Not Found"
            });
        }
       const piepline = [
            {$match: {userId}},
            { 
                $lookup: {
                    from: "users", 
                    localField: "userId",
                    foreignField: "id", 
                    as: "userData",
                },
            },
        ]
        piepline.push({
            $project: {
                _id: 0,
                id: 1,
                userId: 1,
                userName: {
                    $concat: [{ $arrayElemAt: ["$userData.firstName", 0] }," ",{ $arrayElemAt: ["$userData.lastName", 0] }]
                },
                date: 1,
                status: 1
            }
        })

       const attendance = await Attendance.aggregate(piepline);

        return res.status(200).json({
            message: "Attendance fetched successfully",
            success: true,
            data: attendance, 
        }); 
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
} 