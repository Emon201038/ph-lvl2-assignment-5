/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import User from "./user.model";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { UserService } from "./user.service";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserService.createUser(req.body);

  sendResponse(res,
    {
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      message: "User created successfully.",
      data: user
    })
})

const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const users = await User.find()
  sendResponse(res,
    {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "All users retrieved successfully.",
      data: users
    })
});

const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const user = await User.findById(req.params.id)
  sendResponse(res,
    {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "User retrieved successfully.",
      data: user
    })
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserService.updateUser();
});

const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserService.deleteUser();
});

export const UserController = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}