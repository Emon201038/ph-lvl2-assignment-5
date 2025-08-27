import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { AuthProvider, IAuthProvider, IUser, UserRole } from "./user.interface";
import { envVars } from "../../config/env";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      enum: AuthProvider,
      required: [true, "User auth provider is required"],
    },
    providerId: {
      type: String,
      required: [true, "User auth provider id is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "User name is required."],
    },
    email: {
      type: String,
      required: [true, "User email is required."],
    },
    phone: {
      type: String,
      match: [
        /^(?:\+8801|01)[3-9]\d{8}$/,
        "Phone number is invalid. Please enter a valid Bangladeshi phone number starting with +8801 or 01",
      ],
      set: (v: string) => {
        if (!v) return v; // allow empty or undefined
        if (v.startsWith("01")) {
          return `+88${v}`;
        }
        return v; // already starts with +8801, return as-is
      },
    },
    picture: String,
    adress: {
      state: String,
      city: String,
      area: String,
      adress: String,
    },
    password: {
      type: String,
      // required: [true, "User password is required"],
      trim: true,
      minLength: [6, "User password must be at least 6 characters"],
      set: (v: string) => {
        return bcrypt.hashSync(
          v,
          bcrypt.genSaltSync(Number(envVars.SALT_ROUNDS))
        );
      },
    },
    role: {
      type: String,
      enum: ["SENDER", "RECEIVER", "ADMIN"],
      default: UserRole.RECEIVER,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    auths: [authProviderSchema],
    parcels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Parcel",
      },
    ],
    lastLogin: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
