import express from "express";
import AdminUserController from "../controllers/admin.controller.js";

const userRouter = express.Router();

userRouter.get("/users",  AdminUserController.getAllUsers);
userRouter.get("/users/:id",  AdminUserController.getUserById);


userRouter.post("/users/", AdminUserController.createUser);
userRouter.patch("/users/:id/role", AdminUserController.updateUserRole);
userRouter.delete("/users/:id", AdminUserController.deleteUser);

export default userRouter;