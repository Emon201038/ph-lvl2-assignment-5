import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { StatsController } from "./stats.controller";
const statsRouter = express.Router();

statsRouter.get(
  "/users",
  checkAuth(UserRole.ADMIN),
  StatsController.usersStats
);

statsRouter.get(
  "/parcels",
  checkAuth(UserRole.ADMIN),
  StatsController.parcelsStats
);

statsRouter.get(
  "/monthly-report",
  checkAuth(UserRole.ADMIN),
  StatsController.monthlyReport
);

export default statsRouter;
