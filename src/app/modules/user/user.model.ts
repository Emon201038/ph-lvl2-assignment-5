import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { AuthProvider, IUser, UserRole } from "./user.interface";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "User name is required."]
  },
  email: {
    type: String,
    required: [true, "User email is required."]
  },
  phone: String,
  adress: String,
  password: {
    type: String,
    // required: [true, "User password is required"],
    trim: true,
    minLength: [6, "User password must be at least 6 characters"],
    set: (v: string) => {
      return bcrypt.hashSync(v, bcrypt.genSaltSync(10));
    },
  },
  role: {
    type: String,
    enum: ['SENDER', 'RECEIVER', 'ADMIN'],
    default: UserRole.RECEIVER
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  auths: [
    {
      provider: {
        type: String,
        enum: AuthProvider,
        required: [true, "User auth provider is required"]
      },
      providerId: {
        type: String,
        required: [true, "User auth provider id is required"]
      }
    }
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order"
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

const User = model<IUser>('User', userSchema);

export default User;