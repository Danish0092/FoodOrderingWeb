import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId).populate("role");

    if (!user) {
        return res.json({ message: "User not found" });
    }

    if (user.role.name !== "admin") {
        return res.json({ message: "Admin access only" });
    }

    next();
};

export default isAdmin;