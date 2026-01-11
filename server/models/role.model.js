import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const roleModel = mongoose.model.role || mongoose.model("role", roleSchema);
export default roleModel;