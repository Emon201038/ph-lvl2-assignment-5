import { Types } from "mongoose";

export enum UserRole {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  ADMIN = "ADMIN",
};

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  GITHUB = "GITHUB",
  CREDENTIALS = "CREDENTIALS"
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}
export interface IUser {
  name: string;
  email: string;
  phone: string;
  picture?: string;
  adress?: string;
  password?: string;
  role: UserRole;
  isBlocked: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  auths: IAuthProvider[];
  orders: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
