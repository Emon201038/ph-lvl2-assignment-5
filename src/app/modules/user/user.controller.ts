/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import User from "./user.model";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { UserService } from "./user.service";
import { JwtPayload } from "../../utils/jwt";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      message: "User created successfully.",
      data: user,
    });
  }
);

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "All users retrieved successfully.",
      data: await UserService.getAllUsers(req.query as Record<string, string>),
    });
  }
);

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "User retrieved successfully.",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.updateUser(
      req.params.id,
      req.body,
      req.user as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "User updated successfully.",
      data: user,
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.deleteUser(
      req.user as JwtPayload,
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "User deleted successfully.",
      data: user,
    });
  }
);

export const UserController = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
