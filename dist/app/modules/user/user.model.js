"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("./user.interface");
const env_1 = require("../../config/env");
const authProviderSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        enum: user_interface_1.AuthProvider,
        required: [true, "User auth provider is required"],
    },
    providerId: {
        type: String,
        required: [true, "User auth provider id is required"],
    },
}, {
    timestamps: true,
    versionKey: false,
});
const userSchema = new mongoose_1.Schema({
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
        set: (v) => {
            if (!v)
                return v; // allow empty or undefined
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
        set: (v) => {
            return bcryptjs_1.default.hashSync(v, bcryptjs_1.default.genSaltSync(Number(env_1.envVars.SALT_ROUNDS)));
        },
    },
    role: {
        type: String,
        enum: ["SENDER", "RECEIVER", "ADMIN"],
        default: user_interface_1.UserRole.RECEIVER,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Parcel",
        },
    ],
    lastLogin: Date,
}, {
    timestamps: true,
    versionKey: false,
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
