import Enquiry from "../models/enquiry.model.js"
import NewEnrollment from "../models/newEnrollment.model.js"

export const createEnquiryWithEnrollment = async (req, res) => {
  try {
    const data = req.body;

    const enquiry = new Enquiry({
      ...data,
      status: "Enquiry Completed"
    });
    await enquiry.save();

    const enrollment = new NewEnrollment({
      enquiryId: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      location: enquiry.location,
      course: enquiry.course
    });
    await enrollment.save();

    return res.status(201).json({
      success: true,
      message: "Enquiry & Enrollment created successfully",
      data: {
        enquiry,
        enrollment
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Enquiry & Enrollment",
      error: error.message
    });
  }
};
 

export const getAllEnquiry = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },

      ];
    }

    let query = Enquiry.find(filter)
      .select("id name email phone location college course message status remark")
      .sort({ createdAt: -1 });

    if (limitNum > 0) {
      query = query
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
    }

    const enquiry = await query;
    const totalEnquiries = await Enquiry.countDocuments(filter);

    if(enquiry.length === 0)
        {
            return res.status(200).json({
            message: "No data found",
            success: true,
            data: 0,
            totalEnquiries: 0,
            currentPage: pageNum,
            totalPages: 0
        })
    }

    return res.status(200).json({
      message: "Enquiry fetched successfully",
      success: true,
      data: enquiry,
      totalEnquiries: totalEnquiries,
      currentPage: pageNum,
      totalPages:
        limitNum > 0 ? Math.ceil(totalEnquiries / limitNum) : 1,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};



export const getEnquiryById = async(req, res) => {
    try {
        const {id} = req.params;
        const enquiry = await Enquiry.findOne({id}).select("id name email phone location college course message status remark");
        if(!enquiry)
        {
            return res.status(404).json({
                message: "Enquiry Not Found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Enquiry Fetched Successfully",
            success: true,
            data: enquiry,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
        
    }
} 

export const updateEnquiry = async(req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;
        const updatedEnquiry = await Enquiry.findOneAndUpdate({id}, updatedData, {new: true});
        if(!updatedEnquiry)
        {
            return res.status(404).json({
                message: "Enquiry not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Enquiry Updated successfully",
            success: false,
            data: updatedEnquiry
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
}
