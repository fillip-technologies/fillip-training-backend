import Contact from "../models/contact.model.js";

export const createContact = async(req, res) => {
    try {
        const data = req.body
        const newContact = new Contact(data)
        await newContact.save()
        return res.status(201).json({
            message: "Contacted Successfully",
            success: true,
            data: newContact
        }) 
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}

export const getAllContact = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        let filter = {}
        if(search)
        {
            filter.$or = [
                {fullName: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {phone: {$regex: search, $options: "i"}},
                {message: {$regex: search, $options: "i"}},
            ]
        }
        let query = Contact.find()
        .select("id fullName email phone message")
        .sort({createdAt: -1});

        if(limitNum > 0)
        {
            query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
        }

        const contact = await query;
        const totalContact = await Contact.countDocuments(filter);

        if(contact.length === 0)
        {
            return res.status(200).json({
            message: "No data found",
            success: true,
            data: 0,
            totalContacts: 0,
            currentPage: pageNum,
            totalPages: 0
        })
        }

        return res.status(200).json({
            message: "Contact fetched successfully",
            success: true,
            data: contact,
            totalContacts: totalContact,
            currentPage: pageNum,
            totalPages: limitNum > 0 ? Math.ceil(totalContact / limitNum) : 1
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
        
    }
} 


export const updateContact = async(req, res) => {
    try {
        const {id} = req.params
        const updatedData = req.body
        const updatedContacts = await Contact.findOneAndUpdate({id}, updatedData, {new: true})
        if(!updatedContacts)
        {
            return res.status(404).json({
                message: "Not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Updated successfully",
            success: true,
            data: updatedContacts
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update",
            success: false,
            error: error.message
        })
    }
}