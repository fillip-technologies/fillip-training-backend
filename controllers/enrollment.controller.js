import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import Batch from "../models/batch.model.js";
import Student from "../models/student.model.js";
import autoGenerateCertificate from "../utils/autoGenerateCertificate.js";

export const addEnrollment = async (req, res) => {
  try {
    const role = req.user.role;
    const data = req.body;
    
    if (role === "Admin") {
      if (!data.createdBy) {
        return res.status(400).json({
          message: "createdBy is required when Admin enrolls a student",
          success: false,
        });
      }
    } 
    else if (role === "Student") {
      data.createdBy = req.user.id;
    } 
    else {
      return res.status(403).json({
        message: "Unauthorized role",
        success: false,
      });
    }

    data.status = "Enrolled";
    data.courseStatus = "In Progress";

    const existingEnrollment = await Enrollment.findOne({
      createdBy: data.createdBy,
      courseId: data.courseId,
      batchId: data.batchId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Enrollment already exists",
        success: false,
      });
    }

    const studentData = await Student.findOne({ userId: data.createdBy });
    if (!studentData) {
      return res.status(404).json({
        message: "Student Not Found",
        success: false,
      });
    }

    const courseData = await Course.findOne({ id: data.courseId });
    if (!courseData) {
      return res.status(404).json({
        message: "Course Not found",
        success: false,
      });
    }

    const batchData = await Batch.findOne({ id: data.batchId });
    if (!batchData) {
      return res.status(404).json({
        message: "Batch not found",
        success: false,
      });
    }

    const batchEnrollmentCount = await Enrollment.countDocuments({
      batchId: data.batchId,
      courseId: data.courseId,
    });

    if (batchEnrollmentCount >= batchData.capacity) {
      return res.status(400).json({
        message: "Batch is full, cannot enroll more students",
        success: false,
      });
    }

    const newEnrollment = new Enrollment(data);
    await newEnrollment.save();

    studentData.enrollmentId.push(newEnrollment.id);
    await studentData.save();

    batchData.totalStudent += 1;
    await batchData.save();

    const totalCourseEnrollments = await Enrollment.countDocuments({
      courseId: data.courseId,
    });

    courseData.totalEnrollment = totalCourseEnrollments;
    await courseData.save();

    return res.status(200).json({
      message: "Student Enrolled Successfully",
      success: true,
      data: newEnrollment,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to enroll student",
      error: error.message,
      success: false,
    });
  }
};



export const completeCourse = async(req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const enrollment = await Enrollment.findOne({id, userId});
        if(!enrollment)
        {
            return res.status(404).json({
                message: "Enrollment not found for this User",
                success: false,
            })
        }
        enrollment.status = "Completed";
        enrollment.courseStatus = "Completed";
        await enrollment.save();

        const certificate = await autoGenerateCertificate(enrollment.userId, enrollment.courseId);
        return res.status(200).json({
            message: "Course Completed & certificate generated!",
            succes: true,
            data: {
                enrollment,
                certificate
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server error",
            success: false,
            error: error.message
        })
    }
}

export const getAllEnrollment = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query;
        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)

        const pipeline = [
            {$sort: {createdAt: -1}},
            { 
                $lookup: {
                    from: "courses", 
                    localField: "courseId",
                    foreignField: "id", 
                    as: "courseData",
                },
            },
            { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } }, 
            { 
                $lookup: {
                    from: "batches", 
                    localField: "batchId",
                    foreignField: "id", 
                    as: "batchData",
                },
            },
            { $unwind: { path: "$batchData", preserveNullAndEmptyArrays: true } }, 
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
            if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "courseData.courseName": { $regex: search, $options: "i" } },
                        { "batchData.batchName": { $regex: search, $options: "i" } },
                        { "userData.firstName": { $regex: search, $options: "i" } },
                        { "userData.lastName": { $regex: search, $options: "i" } },
                        { "status": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }
        
        if(limitNum > 0)
        {
            pipeline.push({$skip: (pageNum - 1) * limitNum});
            pipeline.push({$limit: limitNum})
        }

        pipeline.push({
            $project: {
                _id: 0,
                id: 1,
                studentFirstName: "$userData.firstName",
                studentLastName: "$userData.lastName",
                courseName: "$courseData.courseName",
                batchName: "$batchData.batchName",
                enrollDate: 1,
                status: 1,
                progress: 1,
            }
        });

        const enrollment = await Enrollment.aggregate(pipeline);
        const totalEnrollment = await Enrollment.countDocuments();

        if(enrollment.length === 0)
        {
            return res.status(200).json({
                message: "No Data Found",
                success: false,
                data: [],
                totalEnrollment: 0,
                currentPage: pageNum,
                totalPages: 0,
            })
        }
        return res.status(200).json({
                message: "All Enrollment fetched successfully",
                success: true,
                data: enrollment,
                totalEnrollment: totalEnrollment,
                currentPage: pageNum,
                totalPages: limitNum > 0 ? Math.ceil(totalEnrollment / limitNum) : 1,
            })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
}


export const getEnrollmentById = async(req, res) => {
    try {
        const {id} = req.params;
        const enrollmentData = await Enrollment.findOne({id})
        if(!enrollmentData)
        {
            return res.status(400).json({
                message: "Enrollment not found",
                success: false
            });
        }
        const pipeline = [
            {$match: {id}},
            { 
                $lookup: {
                    from: "courses", 
                    localField: "courseId",
                    foreignField: "id", 
                    as: "courseData",
                },
            },
            { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } }, 
            { 
                $lookup: {
                    from: "batches", 
                    localField: "batchId",
                    foreignField: "id", 
                    as: "batchData",
                },
            },
            { $unwind: { path: "$batchData", preserveNullAndEmptyArrays: true } }, 
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
            if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "courseData.courseName": { $regex: search, $options: "i" } },
                        { "batchData.batchName": { $regex: search, $options: "i" } },
                        { "userData.firstName": { $regex: search, $options: "i" } },
                        { "userData.lastName": { $regex: search, $options: "i" } },
                        { "status": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }
        
        pipeline.push({
            $project: {
                _id: 0,
                id: 1,
                studentFirstName: "$userData.firstName",
                studentLastName: "$userData.lastName",
                courseName: "$courseData.courseName",
                batchName: "$batchData.batchName",
                enrollDate: 1,
                status: 1,
                progress: 1,
            }
        });

        const enrollment = await Enrollment.aggregate(pipeline);
        
        return res.status(200).json({
                message: "Enrollment fetched successfully",
                success: true,
                data: enrollment,
            })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            succes: false,
            error: error.message
        });
    }
}

export const updateEnrollment = async(req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;
        const updatedEnrollment = await Enrollment.findOneAndUpdate({id}, updatedData, {new: true});
        if(!updatedEnrollment)
        {
            return res.status(404).json({
                message: "Enrollment Not Found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Enrollment Updated Successfully",
            success: true,
            error: error.message,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        })
    }
} 

export const deleteEnrollment = async(req, res) => {
    try {
        const {id} = req.params;
        const deletedEnrollment = await Enrollment.findOneAndDelete({id})
        if(!deletedEnrollment)
        {
            return res.status(404).json({
                message: "Enrollment Not Found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Enrollment Deleted Successfully",
            success: false,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        })
    }
}