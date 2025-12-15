import Enquiry from "../models/enquiry.model.js"

export const createEnquiry = async(req, res) => {
    try {
        const data = req.body;
        const newEnquiry = new Enquiry(data);
        await newEnquiry.save();
        return res.status(201).json({
            message: "Enquiry created successfully",
            success: true,
            data: newEnquiry
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
} 

export const getAllEnquiry = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const filter = {}
        if(search)
        {
            filter.$or = [
                {name: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {phone: {$regex: search, $options: "i"}},
                {id: {$regex: search, $options: "i"}},
            ]
        }
        const enquiry = await Enquiry.find(filter)
        .select("id name email phone location college course message status remark")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)

        const totalEnquiries = await Enquiry.countDocuments()

        if(enquiry === 0)
        {
            return res.status(200).json({
                message: "No Enquiry Found",
                data: [],
                totalEnquiries: 0,
                currentPage: pageNum,
                totalPages: 0
            });
        }
        return res.status(200).json({
                message: "All Enquiry Fetched successfully",
                data: enquiry,
                totalEnquiries: totalEnquiries,
                currentPage: pageNum,
                totalPages: limitNum > 0 ? Math.ceil(totalEnquiries / limitNum) : 1
            });
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}


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
