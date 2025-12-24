import userModel from "../models/user.model.js";
import roleModel from "../models/role.model.js";
import bcrypt from "bcryptjs";

const AdminUserController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await userModel
                .find()
                .select("name email role isAccountVerified")
                .populate("role", "name");
            res.json(users);
        } catch (error) {
            res.json({ message: "Error fetching users", error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await userModel
                .findById(req.params.id)
                .select("name email role isAccountVerified")
                .populate("role", "name");

            if (!user) return res.json({ message: "User not found" });

            res.json(user);
        } catch (error) {
            res.json({ message: "Error fetching user", error: error.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const { name, email, password, roleId } = req.body;

            if (!name || !email || !password || !roleId) {
                return res.json({ message: "Name, email, password, and role are required" });
            }


            const existingUser = await userModel.findOne({ email });
            if (existingUser) return res.json({ message: "Email already exists" });

            const role = await roleModel.findById(roleId);
            if (!role) return res.json({ message: "Role not found" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userModel.create({
                name,
                email,
                password: hashedPassword,
                role: roleId
            });

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.json({
                message: "User created successfully"
            });
        } catch (error) {
            res.json({ message: "Error creating user", error: error.message });
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { roleId } = req.body;

            if (!roleId) {
                return res.json({ message: "roleId is required" });
            }

            const role = await roleModel.findById(roleId);
            if (!role) return res.json({ message: "Role not found" });

            const updatedUser = await userModel
                .findByIdAndUpdate(
                    req.params.id,
                    { role: roleId },
                    { new: true }
                )
                .select("name email role isAccountVerified")
                .populate("role", "name");

            if (!updatedUser) return res.json({ message: "User not found" });

            res.json({ message: "User role updated successfully", user: updatedUser });
        } catch (error) {
            res.json({ message: "Error updating user role", error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const deletedUser = await userModel
                .findByIdAndDelete(req.params.id)
                .select("name email role isAccountVerified");

            if (!deletedUser) return res.json({ message: "User not found" });

            res.json({ message: "User deleted successfully", user: deletedUser });
        } catch (error) {
            res.json({ message: "Error deleting user", error: error.message });
        }
    },
};

export default AdminUserController;
