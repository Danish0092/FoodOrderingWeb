import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.json({
            success: false,
            message: "Not authorized. Please login again."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.json({   
                success: false,
                message: "Invalid token"
            });
        }

        req.userId = decoded.id;
        next();

    } catch (error) {
        return res.json({
            success: false,
            message: "Token expired or invalid"
        });
    }
};

export default userAuth;
