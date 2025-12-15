// import mongoose from "mongoose";
// import generateUniqueId from "../utils/generateUniqueIdGenerator.js";

// const marksheetSchema = new mongoose.Schema({
//     id: {
//         type: String,
//         default: () => generateUniqueId("MARKS")
//     },
//     userId: {
//         type: String,
//         required: true
//     },
//     courseId: {
//         type: String,
//         required: true
//     },
//     assignmentId:{
//         type: String,
//         required: true,
//     },
//     submissionId: {
//         type: String,
//         required: true
//     },
//     marksObtained: {
//         type: Number,
//         required: true
//     },
//     percentage: {
//         type: String,
//         required: true
//     },
//     grade: {
//         type: String,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ["Pass", "Fail"],
//         required: true
//     }
// }, {timestamps: true})

// export default mongoose.model("Marksheet", marksheetSchema)