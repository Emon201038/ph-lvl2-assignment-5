"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const userRouter = express_1.default.Router();
userRouter
    .route("/")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.getUsers)
    .post((0, validateRequest_1.validateRequest)(user_validation_1.createUserSchema), user_controller_1.UserController.createUser);
userRouter
    .route("/role/:id")
    .patch((0, checkAuth_1.checkAuth)(user_interface_1.UserRole.RECEIVER, user_interface_1.UserRole.SENDER), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserRoleSchema), user_controller_1.UserController.updateUserRole);
userRouter
    .route("/:id")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.getUser)
    .put((0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserSchema), user_controller_1.UserController.updateUser)
    .delete((0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.deleteUser);
exports.default = userRouter;
