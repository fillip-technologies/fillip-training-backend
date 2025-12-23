import NewEnrollment from "../models/newEnrollment.model.js";
import Enquiry from "../models/enquiry.model.js";
import autoGenerateCertificate from "../utils/autoGenerateCertificate.js";


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
                enquiryId: 1,
                enrollmentStatus: 1,
                downloadUrl: 1,
                certificateId: 1,

                courseName: "$courseInfo.courseName"
            }
        })

        const enrollments = await NewEnrollment.aggregate(pipeline);
        const totalEnrollments = await NewEnrollment.countDocuments();
        const enrolledCount = await NewEnrollment.countDocuments({enrollmentStatus: "Enrolled"});
        
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
                enrolledCount,
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
                enquiryId: 1,
                enrollmentStatus: 1,
                downloadUrl: 1,
                certificateId: 1,
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

export const completeEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await NewEnrollment.findOne({ id });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    enrollment.enrollmentStatus = "Enrolled";
    await enrollment.save();
    const certificate = await autoGenerateCertificate(enrollment.id);
    enrollment.certificateId = certificate.id;
    enrollment.downloadUrl = `/api/certificates/download/${certificate.id}`;
    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: "Enrollment completed & certificate generated",
      certificateId: certificate.id, 
      downloadUrl: `/api/certificates/download/${certificate.id}`
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to complete enrollment",
      error: error.message
    });
  }
};

export const deleteNewEnrollment = async(req, res) => {
    try {
        const deletedNewEnrollment = await NewEnrollment.findOneAndDelete({id})
        if(!deleteNewEnrollment)
        {
            return res.status(404).json({
                message: "Enrollment not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: `${deletedNewEnrollment?.name} is deleted successfully`,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        }) 
    }
}
