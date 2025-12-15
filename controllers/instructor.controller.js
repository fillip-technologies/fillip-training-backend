import User from "../models/user.model.js";
import Instructor from "../models/instructor.model.js";

export const getAllInstructor = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        let filter = {};
        if(search)
        {

        }
        const piepline = [
            {$match: filter},
            {$sort: {createdAt: -1}},
            {
             $lookup: {
                    from: "courses", 
                    localField: "courseId",
                    foreignField: "id", 
                    as: "courseData",
                },
            },
            {
             $lookup: {
                    from: "classes", 
                    localField: "classId",
                    foreignField: "id", 
                    as: "classData",
                },
            },
            {
             $lookup: {
                    from: "batches", 
                    localField: "batchId",
                    foreignField: "id", 
                    as: "batchData",
                },
            },
            {
             $lookup: {
                    from: "users", 
                    localField: "userId",
                    foreignField: "id", 
                    as: "instructorData",
                },
            },
        ]
        if(limitNum > 0)
        {
            piepline.push({$skip: (pageNum - 1) * limitNum})
            piepline.push({$limit: limit})
        }
        piepline.push({
            $project: {
                _id: 0,
                userId: 1,
                specialization: 1,
                InstructorName: {
                    $concat: [{ $arrayElemAt: ["$instructorData.firstName", 0] }," ",{ $arrayElemAt: ["$instructorData.lastName", 0] }]
                },
                instructorEmail: "$instructorData.email",
                instructorPhone: "$instructorData.phone",
                courseName: "$courseData.courseName",
                batchName: "$batchData.batchName",
                className: "$classData.moduleName"
            }
        });

        const instructors = await Instructor.aggregate(piepline);
        const totalInstructors = await Instructor.countDocuments();

        if(instructors.length === 0)
        {
            return res.status(200).json({
                message: "No Data Found",
                success: true,
                data: [],
                totalInstructors: 0,
                currentpage: pageNum,
                totalPages: 0,
            });
        }
        return res.status(200).json({
                message: "All Instructors fetched successfully",
                success: true,
                data: instructors,
                totalInstructors: totalInstructors,
                currentpage: pageNum,
                totalPages: limitNum > 0 ? Math.ceil(totalInstructors / limitNum) : 1,
            });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        }) 
    }
} 

export const getInstructorById = async(req, res) => {
   try {
        const {userId} = req.params;
        const instructordata = await User.findOne({id: userId});
        if(!instructordata)
        {
            return res.status(404).json({
                message: "Instructor Not Found",
                success: false,
            })
        }
        const piepline = [
            {$match: {userId}},
            {
             $lookup: {
                    from: "courses", 
                    localField: "courseId",
                    foreignField: "id", 
                    as: "courseData",
                },
            },
            {
             $lookup: {
                    from: "classes", 
                    localField: "classId",
                    foreignField: "id", 
                    as: "classData",
                },
            },
            {
             $lookup: {
                    from: "batches", 
                    localField: "batchId",
                    foreignField: "id", 
                    as: "batchData",
                },
            },
            {
             $lookup: {
                    from: "users", 
                    localField: "userId",
                    foreignField: "id", 
                    as: "userData",
                },
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
        ]
        piepline.push({
            $project: {
                _id: 0,
                specialization: 1,
                instructorId: "$userData.id",
                instructorName: "$userData.firstName",
                instructorEmail: "$userData.email",
                instructorPhone: "$userData.phone",
                instructorLocation: "$userData.location",
                courseName: "$courseData.courseName",
                batchName: "$batchData.batchName",
                className: "$classData.moduleName"
            }
        });

        const instructors = await Instructor.aggregate(piepline);

        return res.status(200).json({
                message: "All Instructors fetched successfully",
                success: true,
                data: instructors,
            });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        }) 
    }
}

export const updateInstructor = async(req, res) => {
      try {
            const { userId } = req.params;
            const data = req.body;

            const instructor = await Instructor.findOne({userId})
            if (!instructor) {
                return res.status(404).json({ 
                    message: "Instructor not found",
                    success: false,
                });
            }
    
            const userFields = ["firstName", "lastName", "email", "phone", "location"];
            const instructorFields = ["specialization", "batchId", "courseId", "classId"];
    
            const userUpdate = {};
            const instructorUpdate = {};
    
            Object.keys(data).forEach(key => {
                if (userFields.includes(key)) 
                    userUpdate[key] = data[key];

                if (instructorFields.includes(key)) 
                    instructorUpdate[key] = data[key];
            });
    
            let updatedUser = null;
            if (Object.keys(userUpdate).length > 0) {
                updatedUser = await User.findOneAndUpdate(
                    { _id: userId }, 
                    userUpdate,
                    { new: true }
                );
            }
    
            let updatedInstructor = null;
            if (Object.keys(instructorUpdate).length > 0) {
                updatedInstructor = await Instructor.findOneAndUpdate(
                    { userId},
                    instructorUpdate,
                    { new: true }
                );
            }
    
            return res.status(200).json({
                message: "Instructor updated successfully",
                success: true,
                data: {
                    // instructor,
                    updatedUser,
                    updatedInstructor
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Internal server error",
                success: false,
                error: error.message,
            });
        }
} 

export const deleteInstructor = async(req, res) => {
    try {
        const {id} = req.params;
        const deletedInstructor = await User.findOneAndDelete({id})
        if(deletedInstructor)
        {
            return res.status(404).json({
                message: "Instructor Not Found",
                success: false,
            })
        }
        await Instructor.findOneAndDelete({ userId: id });
        return res.status(200).json({
            message: `${deletedInstructor?.firstName} is deleted successfully`,
            success: true,
        }) 
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
}