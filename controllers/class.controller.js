import Class from "../models/class.model.js";
import Batch from "../models/batch.model.js";
import Instructor from "../models/instructor.model.js";

export const createClass = async(req, res) => {
    try {
        const data = req.body;
        const batch = await Batch.findOne({id: data.batchId})
        if(!batch)
        {
            return res.status(400).json({
            message: "Batch not found",
            success: false
        }) ; 
        }
        const instructor = await Instructor.findOne({userId: data.instructorId});
        if(!instructor)
        {
            return res.status(404).json({
                message: "Instructor not found",
                success: false,
            })
        }
            const newClass = new Class(data);
            await newClass.save();


            if (!Array.isArray(batch.classId)) 
            {
            batch.classId = [];
            }
            batch.classId.push(newClass.id);
            await batch.save();

            if (!Array.isArray(instructor.classId)) 
            {
            instructor.classId = [];
            }
            instructor.classId.push(newClass.id);
            await instructor.save();

            return res.status(201).json({
            message: "Class created successfully",
            success: true,
            data: newClass
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
}

export const getAllClasses = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        let filter = {};

        if(search)
        {
            filter.$or = [
                {id: {$regex: search, $options: "i"}},
                {classTime: {$regex: serach, $options: "i"} }
            ]
        }

        const pipeline = [
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
                    localField: "instructorId",
                    foreignField: "id", 
                    as: "instructorData",
                },
            },
        ]

        if(limitNum > 0)
        {
            pipeline.push({$skip: (pageNum - 1) * limitNum})
            pipeline.push({$limit: limit})
        }

        pipeline.push({
            $project: {
                _id: 0,
                id: 1,
                moduleName: 1,
                classTime: 1,
                courseName: "$courseData.courseName",
                batchName: "$batchData.batchName",
                InstructorName: {
                    $concat: [{ $arrayElemAt: ["$instructorData.firstName", 0] }," ",{ $arrayElemAt: ["$instructorData.lastName", 0] }]
                }
            }
        });

        const classes = await Class.aggregate(pipeline);
        const totalClasses = await Class.countDocuments();

        if(classes.length === 0)
        {
            return res.status(200).json({
                message: "No Data Found",
                success: true,
                data: [],
                totalClasses: 0,
                currentPage: pageNum,
                totalPages: 0,
            })
        }
         return res.status(200).json({
                message: "Total Classses Fetched Successfully",
                success: true,
                data: classes,
                totalClasses: totalClasses,
                currentPage: pageNum,
                totalPages: limitNum > 0 ? Math.ceil(totalClasses / limitNum) : 1,
            })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
} 



export const getClassById = async(req, res) => {
     try {
        const {id} = req.params;
        const classData = await Class.findOne({id})
        if(!classData)
        {
            return req.status(404).json({
                message: "Class Not Found",
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
                    localField: "instructorId",
                    foreignField: "id", 
                    as: "instructorData",
                },
            },
        ]
        pipeline.push({
            $project: {
                _id: 0,
                id: 1,
                moduleName: 1,
                classTime: 1,
                courseName: "$courseData.courseName",
                batchName: "$batchData.batchName",
                InstructorName: {
                    $concat: [{ $arrayElemAt: ["$instructorData.firstName", 0] }," ",{ $arrayElemAt: ["$instructorData.lastName", 0] }]
                }
            }
        });

        const classes = await Class.aggregate(pipeline);

         return res.status(200).json({
                message: "Classs Fetched Successfully",
                success: true,
                data: classes,
            })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
}


export const updateClass = async(req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;
        const updatedClass = await Class.findOneAndUpdate({id}, updatedData, {new: true});
        if(!updatedClass)
        {
            return res.status(404).json({
                message: "Class Not Found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Class Updated successfully",
            success: true,
            data: updatedClass,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
}

export const deleteClass = async(req, res) => {
    try {
        const {id} = req.params;
        const deletedClass = await Class.findOneAndDelete({id});
        if(!deletedClass)
        {
            return res.status(404).json({
                message: "Class Not Found",
                success: false,
            })
        }
        return res.status(200).json({
            message: `${deletedClass?.moduleName} is deleted successfully`,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        })   
    }
}