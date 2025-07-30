
import express from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { loginSchema, changePasswordSchema, resetPasswordSchema, forgetPasswordSchema } from './auth.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '../user/user.interface';
const authRouter = express.Router();

// credentials
authRouter.post("/login", validateRequest(loginSchema), AuthController.login);
authRouter.get("/logout", AuthController.logout);
authRouter.get("/refresh-token", AuthController.refreshToken);

authRouter.post("/set-password", checkAuth(...Object.values(UserRole)), AuthController.setPassword);

authRouter.post("/change-password", checkAuth(...Object.values(UserRole)),
  validateRequest(changePasswordSchema),
  AuthController.changePassword);

authRouter.post("/forget-password", validateRequest(forgetPasswordSchema), AuthController.forgetPassword);

authRouter.post("/reset-password",
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword);

// google
authRouter.get("/google", (req, res, next) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate('google', { scope: ['email', 'profile'], state: redirect as string })(req, res, next)
});
authRouter.get("/google/callback", passport.authenticate('google', { failureRedirect: "/login" }), AuthController.googleCallback);

export default authRouter;