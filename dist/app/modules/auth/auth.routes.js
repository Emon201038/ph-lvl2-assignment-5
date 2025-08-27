"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_validation_1 = require("./auth.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const authRouter = express_1.default.Router();
// credentials
authRouter.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.loginSchema), auth_controller_1.AuthController.login);
authRouter.post("/logout", auth_controller_1.AuthController.logout);
authRouter.get("/refresh-token", auth_controller_1.AuthController.refreshToken);
authRouter.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), auth_controller_1.AuthController.setPassword);
authRouter.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), (0, validateRequest_1.validateRequest)(auth_validation_1.changePasswordSchema), auth_controller_1.AuthController.changePassword);
authRouter.post("/forget-password", (0, validateRequest_1.validateRequest)(auth_validation_1.forgetPasswordSchema), auth_controller_1.AuthController.forgetPassword);
authRouter.post("/reset-password", (0, validateRequest_1.validateRequest)(auth_validation_1.resetPasswordSchema), auth_controller_1.AuthController.resetPassword);
// google
authRouter.get("/google", (req, res, next) => {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", {
        scope: ["email", "profile"],
        state: redirect,
    })(req, res, next);
});
authRouter.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), auth_controller_1.AuthController.googleCallback);
authRouter.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), auth_controller_1.AuthController.me);
exports.default = authRouter;
