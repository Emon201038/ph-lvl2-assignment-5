import AppError from "../../helpers/appError";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { JwtPayload } from "../../utils/jwt";
import { AuthProvider, IAuthProvider, IUser, UserRole } from "./user.interface";
import User from "./user.model";

const getAllUsers = async () => {
  return {}
}

const getUser = async () => {
  return {}
};

const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const { email, ...res } = payload;

  // check if user already exist
  const isExists = await User.findOne({ email });

  if (isExists) {
    throw new AppError(HTTP_STATUS.CONFLICT, "User already exist with this email.");
  };

  const auth: IAuthProvider = {
    provider: AuthProvider.CREDENTIALS,
    providerId: email as string
  };

  const user = await User.create({ email, ...res, auths: [auth] });

  return user
};

const updateUser = async (userId: string, payload: Partial<IUser>, loggedInUser: JwtPayload) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
  };
  if (payload.email) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, "You can't update email.");
  };

  if (loggedInUser.role !== UserRole.ADMIN) {
    if (user.isDeleted || user.isBlocked) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "User is blocked or deleted.");
    }

    if (payload.role === UserRole.ADMIN) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "You can't update role.");
    };

    if (payload.isBlocked || payload.isVerified || payload.isDeleted) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "You can't update status.");
    };
  }


  return await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
};

const deleteUser = async (loggedInUser: JwtPayload, userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
  };

  if (user.role === UserRole.ADMIN) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, "You are not authorized to delete this user.");
  };


  if (loggedInUser.role !== UserRole.ADMIN) {
    if (loggedInUser.userId !== user._id.toString()) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "You are not authorized to delete this user.");
    };

    if (user.isDeleted || user.isBlocked) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "User is blocked or deleted.");
    };
  }


  return await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, runValidators: true });
};



export const UserService = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}