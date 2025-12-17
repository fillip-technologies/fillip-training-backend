import NewEnrollment from "../models/newEnrollment.model.js";
import Enquiry from "../models/enquiry.model.js";

export const createNewEnrollment = async(req, res) => {
  try {
    const { enquiryId } = req.body;

    const enquiry = await Enquiry.findOne({ id: enquiryId });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    const enrollment = new NewEnrollment({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      location: enquiry.location,
      course: enquiry.course
    });

    await enrollment.save();

    enquiry.status = "Enquiry Completed";
    await enquiry.save();

    return res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
      error: error.message
    });
  }
};


export const getAllNewEnrollment = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        let filter = {}
        if(search)
        {
            filter.$or = [
                {id: {$regex: search, $options: "i"}},
                {name: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {enrollmentStatus: {$regex: search, $options: "i"}},
            ]
        }
        const pipeline = [
            {$match: filter},
            {$sort: {createdAt: -1}},
            {
             $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "id",
                as: "courseInfo"
                },
            },
            {$unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true }},
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
                name: 1,
                email: 1,
                phone: 1,
                courseName: "$courseInfo.courseName"
            }
        })

        const enrollments = await NewEnrollment.aggregate(pipeline);
        const totalEnrollments = await NewEnrollment.countDocuments();

        if(enrollments.length === 0)
        {
            return res.status(200).json({
                message: "No data found",
                success: false,
                data: [],
                totalEnrollments: 0,
                currentPage: pageNum,
                totalPages: 0
            })

        }
         return res.status(200).json({
                message: "All enrollments fetched successfully",
                success: true,
                data: enrollments,
                totalEnrollments: totalEnrollments,
                currentPage: pageNum,
                totalPages: limitNum > 0 ? Math.ceil(totalEnrollments / limitNum) : 1,
            });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch enrollments list",
            success: false,
            error: error.message
        })
    }
} 


export const getEnrollmentById = async(req, res) => {
    try {
        const {id} = req.params
        const pipeline = [
            {$match: {id}},
            {
             $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "id",
                as: "courseInfo"
                },
            },
            {$unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true }},
        ]

         pipeline.push({
            $project: {
                _id: 0,
                id: 1,
                name: 1,
                email: 1,
                phone: 1,
                courseName: "$courseInfo.courseName"
            }
        })

        const enrollments = await NewEnrollment.aggregate(pipeline);

         return res.status(200).json({
                message: "Enrollment fetched successfully",
                success: true,
                data: enrollments,
            });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch Enrollment",
            success: false,
            error: error.message
        })
    }
}

export const updateNewEnrollment = async(req, res) => {
    try {
        const {id} = req.params
        const updatedData = req.body
        const updatedEnrollmentData = await NewEnrollment.findOneAndUpdate({id}, updatedData, {new: true})
        if(!updatedEnrollmentData)
        {
            return res.status(404).json({
                message: "Enrollment not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Enrollment updated successfully",
            success: true,
            data: updatedEnrollmentData
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update",
            success: false,
            error: error.message
        })
    }
}