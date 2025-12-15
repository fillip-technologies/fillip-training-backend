import Course from "../models/course.model.js";
import Instructor from "../models/instructor.model.js";
import CourseCategory from "../models/courseCategory.model.js";

export const addCourse = async(req, res) => {
    try {
        const data = req.body;
        const coursecategory = await CourseCategory.findOne({id: data.courseCategoryId});
        if(!coursecategory)
        {
            return res.status(404).json({
                message: "Course category not found",
                success: false
            });
        }
        const instructor = await Instructor.findOne({userId: data.instructorId});
        if(!instructor)
        {
            return res.status(404).json({
                message: "Instructor not found",
                success: false,
            })
        }
        const newCourse = new Course(data)
        await newCourse.save();

        if (!Array.isArray(instructor.courseId)) 
        {
        instructor.courseId = [];
        }
        instructor.courseId.push(newCourse.id);
        await instructor.save();

        return res.status(201).json({
            message: "Course created successfully",
            success: true,
            data: newCourse,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
}

export const getAllCourses = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const filter = {};

    if(search)
    {
        filter.$or = [
            {id: {$regex: search, $options: "i"}},
            {courseName: {$regex: search, $options: "i"}},
        ]
    }
    const pipeline = [
        {$match: filter},
        {$sort: {createdAt: -1}},
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
                    localField: "instructorId",
                    foreignField: "id",
                    as: "instructorData",
                },
            },
            {
                $lookup: {
                    from: "coursecategories",
                    localField: "courseCategoryId",
                    foreignField: "id",
                    as: "courseCategoryData",
                },
            },
            { $unwind: { path: "$courseCategoryData", preserveNullAndEmptyArrays: true } },
    ]
    if(limitNum > 0)
    {
        pipeline.push({$skip: (pageNum - 1) * limitNum});
        pipeline.push({$limit: limitNum})
    }
    pipeline.push({
        $project: {
            _id: 0,
            id: 1,
            courseCategoryName: "$courseCategoryData.name",
            courseName: 1,
            courseDuration: 1,
            coursePrice: 1,
            courseSyllabus: 1,
            batchNames: "$batchData.batchName",
            InstructorName: {
                    $concat: [{ $arrayElemAt: ["$instructorData.firstName", 0] }," ",{ $arrayElemAt: ["$instructorData.lastName", 0] }]
                },
            totalEnrollment: 1,
        }
    })

    const course = await Course.aggregate(pipeline)
    const totalCourse = await Course.countDocuments()

    if(course.length === 0)
    {
        return res.status(200).json({
            message: "No data found",
            data: [],
            totalCourse: 0,
            currentPage: pageNum,
            totalPage: 0
        })
    }
       return res.status(200).json({
            message: "Courses Fetched Successfully",
            data: course,
            totalCourse: totalCourse,
            currentPage: pageNum,
            totalPage: limitNum > 0 ? Math.ceil (totalCourse / limitNum) : 1,
        }) 
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
} 


export const getCourseById = async(req, res) => {
    try {
        const {id} = req.params;
        const courseData = await Course.findOne({id})
        if(!courseData)
        {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            });
        }

        const pipeline = [
        {$match: {id}},
        {$sort: {createdAt: -1}},
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
                    localField: "instructorId",
                    foreignField: "id",
                    as: "instructorData",
                },
            },
            {
                $lookup: {
                    from: "coursecategories",
                    localField: "courseCategoryId",
                    foreignField: "id",
                    as: "courseCategoryData",
                },
            },
            { $unwind: { path: "$courseCategoryData", preserveNullAndEmptyArrays: true } },
    ]
   
    pipeline.push({
        $project: {
            _id: 0,
            id: 1,
            courseCategoryName: "$courseCategoryData.name",
            courseName: 1,
            courseDuration: 1,
            coursePrice: 1,
            courseSyllabus: 1,
            batchNames: "$batchData.batchName",
            InstructorName: {
                    $concat: [{ $arrayElemAt: ["$instructorData.firstName", 0] }," ",{ $arrayElemAt: ["$instructorData.lastName", 0] }]
                },
            totalEnrollment: 1,
        }
    })

    const course = await Course.aggregate(pipeline)
       return res.status(200).json({
            message: "Course Fetched Successfully",
            data: course,
        }) 
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
}

export const updateCourse = async(req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;
        const updatedCourse = await Course.findOneAndUpdate({id}, updatedData, {new: true});
        if(!updatedCourse)
        {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Course Updated Successfully",
            success: true,
            data: updatedCourse,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
}

export const deleteCourse = async(req, res) => {
    try {
        const {id} = req.params
        const deletedCourse = await Course.findOneAndDelete({id})
        if(!deletedCourse)
        {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            });
        }
        return res.status(200).json({
            message: `${deletedCourse?.courseName} is deleted successfully`,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
}