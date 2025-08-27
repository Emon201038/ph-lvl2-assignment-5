"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const stats_controller_1 = require("./stats.controller");
const statsRouter = express_1.default.Router();
statsRouter.get("/users", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), stats_controller_1.StatsController.usersStats);
statsRouter.get("/parcels", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), stats_controller_1.StatsController.parcelsStats);
statsRouter.get("/monthly-report", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), stats_controller_1.StatsController.monthlyReport);
exports.default = statsRouter;
