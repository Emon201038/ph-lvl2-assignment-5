/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const usersStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users stats retrieved successfully.",
      data: await StatsService.usersStats(),
    });
  }
);
const parcelsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcels stats retrieved successfully.",
      data: await StatsService.parcelsStats(),
    });
  }
);

const monthlyReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Monthly report retrieved successfully.",
      data: await StatsService.monthlyReport(),
    });
  }
);

export const StatsController = {
  usersStats,
  parcelsStats,
  monthlyReport,
};
