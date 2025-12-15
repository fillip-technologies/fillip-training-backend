import CourseCategory from "../models/courseCategory.model.js";

export const createCourseCategory = async(req, res) => {
    try {
        const data = req.body
        const exisitingCategory = await CourseCategory.findOne({name: data.name})
        if(exisitingCategory)
        {
            return res.status(400).json({
                message: "Course Category already present",
                success: false,
            })
        }
        const newcategory = new CourseCategory(data)
        await newcategory.save();
        return res.status(201).json({
            message: "Course Category Created Successfully",
            success: true,
            data: newcategory,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        })
    }
} 

export const getAllCourseCategory = async(req, res) => {
    try {
        const {page = 1, limit = 10, search} = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        let filter = {}
        if(search)
        {
            filter.$or = [
                {id: {$regex: search, $options: "i"}},
                {name: {$regex: search, $options: "i"}},
            ]
        }
        const allCourseCategory = await CourseCategory
        .find(filter)
        .select("id name")
        .sort({createdAt: -1})
        .skip((pageNum -1) * limitNum)
        .limit(limitNum)

        const totalCourseCategory = await CourseCategory.countDocuments()

        if(allCourseCategory.length === 0)
        {
            return res.status(200).json({
            message: "No Data Found",
            success: false,
            data: [],
            totalCourseCategory: 0,
            currentPage: pageNum,
            totalPage: 0,
        });
        }

        return res.status(200).json({
            message: "All Course Category fetched successfully",
            success: true,
            data: allCourseCategory,
            totalCourseCategory: totalCourseCategory,
            currentPage: pageNum,
            totalPage: limitNum > 0 ? Math.ceil(totalCourseCategory / limitNum) : 1,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        })
    }
}


export const updateCourseCategory = async(req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;
        const updatedCourseCategory = await CourseCategory.findOneAndUpdate({id}, updatedData, {new: true})
        if(!updatedCourseCategory)
        {
            return res.status(404).json({
                message: "Course Category not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Course Category updated successfully",
            success: true,
            data: updatedCourseCategory
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        })
    }
}

export const deleteCourseCategory = async(req, res) => {
    try {
        const {id} = req.params
        const deletedCourseCategory = await CourseCategory.findOneAndDelete({id})
        if(!deletedCourseCategory)
        {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }
        return res.status(200).json({
            message: `${deletedCourseCategory?.name} is deleted successfully`,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        })
    }
}