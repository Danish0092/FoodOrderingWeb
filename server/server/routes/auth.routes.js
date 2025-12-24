import express from "express";
import { login, register, logout, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword } from "../controllers/auth.controller.js";
import userAuth from "../middlewares/user.auth.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;