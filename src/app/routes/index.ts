import express from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";
import otpRoute from "../modules/otp/otp.routes";
import parcelRouter from "../modules/parcel/parcel.routes";
import statsRouter from "../modules/stats/stats.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/otp",
    route: otpRoute,
  },
  {
    path: "/parcels",
    route: parcelRouter,
  },
  {
    path: "/stats",
    route: statsRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
