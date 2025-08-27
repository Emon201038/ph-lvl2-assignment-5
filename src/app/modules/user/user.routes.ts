import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createUserSchema,
  updateUserRoleSchema,
  updateUserSchema,
} from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(checkAuth(UserRole.ADMIN), UserController.getUsers)
  .post(validateRequest(createUserSchema), UserController.createUser);

userRouter
  .route("/role/:id")
  .patch(
    checkAuth(UserRole.RECEIVER, UserRole.SENDER),
    validateRequest(updateUserRoleSchema),
    UserController.updateUserRole
  );

userRouter
  .route("/:id")
  .get(checkAuth(UserRole.ADMIN), UserController.getUser)
  .put(
    checkAuth(...Object.values(UserRole)),
    validateRequest(updateUserSchema),
    UserController.updateUser
  )
  .delete(checkAuth(...Object.values(UserRole)), UserController.deleteUser);

export default userRouter;
