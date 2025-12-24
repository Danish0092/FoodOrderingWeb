import express from "express";
import userAuth from "../middlewares/user.auth.js";
import { getMyProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", userAuth, getMyProfile);

export default userRouter;