import jwt from "jsonwebtoken"

export const authenticate = (req, res, next) => {
    const token = req.cookies?.token
    if(!token)
    {
        return res.status(404).json({
            message: "Token not found",
            success: false,
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server error",
            success: false,
            error: error.message
        })
    }
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
        {
            return res.status(403).json({
                message: "Access Denied: Unauthorized User",
                success: false
            })
        }
        next();
    }
}