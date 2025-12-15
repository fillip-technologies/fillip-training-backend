// import Assignment from "../models/assignment.model.js";

// export const createAssignment = async(req, res) => {
//     try {
//         const data = req.body;
//         const newAssignment = new Assignment(data)
//         await newAssignment.save();
//         return res.status(201).json({
//             message: "Assignment Created Successfully",
//             success: true,
//             data: newAssignment,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//             error: error.message
//         });
//     }
// } 

// export const getAllAssignment = async(req, res) => {
//     try {
//         const {page = 1, limit = 10, search} = req.query

//         const pageNum = parseInt(page);
//         const limitNum = parseInt(limit);
//         const pipeline = [
//             {$sort: {createdAt: -1}},
//             {
//                 $lookup: {
//                     from: "courses",
//                     localField: "courseId",
//                     foreignField: "id",
//                     as: "courseData"
//                 }
//             },
//             {$unwind: {path: "$courseData", preserveNullAndEmptyArrays: true}}
//         ]
//         if(search) 
//         {
//             pipeline.push({
//                 $match: {
//                     $or: [
//                         {"courseData.courseName": {$regex: search, $options: "i"}},
//                         {"id": {$regex: search, $options: "i"}},
//                         {"assignmentName": {$regex: search, $options: "i"}},
//                     ],
//                 },
//             });
//         }
//         if(limitNum > 0)
//         {
//             pipeline.push({$skip: (pageNum - 1) * limitNum});
//             pipeline.push({$limit: limitNum});
//         }

//         pipeline.push({
//             $project: {
//                 _id: 0,
//                 id: 1,
//                 assignmentName: 1,
//                 courseName: "$courseData.courseName",
//                 dueDate: 1,
//                 question: 1,
//                 answer: 1,
//                 totalMarks: 1,
//                 submission: 0
//             }
//         })

//         const assignment = await Assignment.aggregate(pipeline);
//         const totalAssigment = await Assignment.countDocuments();

//         if(assignment.length === 0)
//         {
//             return res.status(200).json({
//                 message: "No Data Found",
//                 success: false,
//                 data: [],
//                 totalAssigment: 0,
//                 currentPage: pageNum,
//                 totalPages: 0,
//             })
//         }
//          return res.status(200).json({
//                 message: "All Assignment fetched successfully",
//                 success: true,
//                 data: assignment,
//                 totalAssigment: totalAssigment,
//                 currentPage: pageNum,
//                 totalPages: limitNum > 0 ? Math.ceil(totalAssigment / limitNum) : 1,
//             });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//             error: error.message
//         })
//     }
// } 

// export const getAssignmentById = async(req, res) => {
//   try {
//         const {id} = req.params
//         const assignmentData = await Assignment.findOne({id});
//         if(!assignmentData)
//         {
//             return res.status(404).json({
//                 message: "Assignment not found",
//                 success: false,
//             })
//         }
//         const pipeline = [
//             {$match: {id}},
//             {
//                 $lookup: {
//                     from: "courses",
//                     localField: "courseId",
//                     foreignField: "id",
//                     as: "courseData"
//                 }
//             },
//             {$unwind: {path: "$courseData", preserveNullAndEmptyArrays: true}}
//         ]
//         pipeline.push({
//             $project: {
//                 _id: 0,
//                 id: 1,
//                 assignmentName: 1,
//                 courseName: "$courseData.courseName",
//                 dueDate: 1,
//                 question: 1,
//                 answer: 1,
//                 totalMarks: 1,
//                 submission: 0
//             }
//         })

//         const assignment = await Assignment.aggregate(pipeline);

//          return res.status(200).json({
//                 message: "All Assignment fetched successfully",
//                 success: true,
//                 data: assignment,
//             });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//             error: error.message
//         })
//     }
// }

// export const submitAssignment = async(req, res) => {
//     try {
//         const {id} = req.params
//         const userId = req.user.id
//         const assignment = await Assignment.findOne({id})
//         if(!assignment)
//         {
//             return res.status(404).json({
//                 message: "Assignment Not Found",
//                 success: false,
//             })
//         }

//         const alreadySubmitted = assignment.submission.some((sub) => sub.userId === userId);
//         if(alreadySubmitted)
//         {
//             return res.status(400).json({
//                 message: "You have already submitted this assignment",
//                 success: false,
//             })
//         }
//         assignment.submission.push({userId})
//         await assignment.save();
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//             error: error.message
//         })  
//     }
// }

// export const getAllAssignmentWithSubmission = async(req, res) => {
//     try {
//         const {page = 1, limit = 10, search} = req.query

//         const pageNum = parseInt(page);
//         const limitNum = parseInt(limit);
//         const pipeline = [
//             {$sort: {createdAt: -1}},
//             {
//                 $lookup: {
//                     from: "courses",
//                     localField: "courseId",
//                     foreignField: "id",
//                     as: "courseData"
//                 }
//             },
//             {$unwind: {path: "$courseData", preserveNullAndEmptyArrays: true}}
//         ]
//         if(search) 
//         {
//             pipeline.push({
//                 $match: {
//                     $or: [
//                         {"courseData.courseName": {$regex: search, $options: "i"}},
//                         {"id": {$regex: search, $options: "i"}},
//                         {"assignmentName": {$regex: search, $options: "i"}},
//                     ],
//                 },
//             });
//         }
//         if(limitNum > 0)
//         {
//             pipeline.push({$skip: (pageNum - 1) * limitNum});
//             pipeline.push({$limit: limitNum});
//         }

//         pipeline.push({
//             $project: {
//                 _id: 0,
//                 id: 1,
//                 assignmentName: 1,
//                 courseName: "$courseData.courseName",
//                 dueDate: 1,
//                 question: 1,
//                 answer: 1,
//                 totalMarks: 1,
//                 submission: 1
//             }
//         })

//         const assignment = await Assignment.aggregate(pipeline);
//         const totalAssigment = await Assignment.countDocuments();

//         if(assignment.length === 0)
//         {
//             return res.status(200).json({
//                 message: "No Data Found",
//                 success: false,
//                 data: [],
//                 totalAssigment: 0,
//                 currentPage: pageNum,
//                 totalPages: 0,
//             })
//         }
//          return res.status(200).json({
//                 message: "All Assignment fetched successfully",
//                 success: true,
//                 data: assignment,
//                 totalAssigment: totalAssigment,
//                 currentPage: pageNum,
//                 totalPages: limitNum > 0 ? Math.ceil(totalAssigment / limitNum) : 1,
//             });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//             error: error.message
//         })
//     }
// }


// export const deleteAssignment = async(req, res) => {
//     try {
//         const {id} = req.params
//         const deletedAssignment = await Assignment.findOneAndDelete({id})
//         if(!deleteAssignment)
//         {
//             return res.status(404).json({
//                 message: "Assignment not found",
//                 success: false
//             })
//         }
//         return res.status(200).json({
//             message: `${deletedAssignment?.assignmentName}`,
//             success: true
//         })
        
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//             error: error.message,
//         })
//     }
// }