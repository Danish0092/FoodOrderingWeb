
import User from "../models/user.model.js";

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                email: user.email
            }
        })

    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
};
