import AppError from "../../helpers/appError";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { AuthProvider, IAuthProvider, IUser } from "./user.interface";
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

const updateUser = async () => {
  return {}
};

const deleteUser = async () => {
  return {}
};



export const UserService = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}