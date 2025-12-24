import { Router } from "express";
import roleModel from "../models/role.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const roles = await roleModel.find().sort({ name: 1 }); 
    res.json(roles);
  } catch (error) {
    res.json({ message: "Error fetching roles", error: error.message });
  }
});

export default router;
