"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
;
const loadEnv = () => {
    const requiredEnv = [
        "PORT",
        "APP_NAME",
        "DB_URI",
        "NODE_ENV",
        "JWT_ACCESS_TOKEN_SECRET",
        "JWT_ACCESS_TOKEN_EXPIRES_IN",
        "JWT_REFRESH_TOKEN_SECRET",
        "JWT_REFRESH_TOKEN_EXPIRES_IN",
        "JWT_RESET_PASSWORD_TOKEN_SECRET",
        "JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN",
        "CLIENT_URL",
        "EXPRESS_SESSION_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "SALT_ROUNDS",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_FROM",
        "SMTP_PASSWORD",
        "REDIS_USERNAME",
        "REDIS_PASSWORD",
        "REDIS_HOST",
        "REDIS_PORT"
    ];
    requiredEnv.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing environment variable: ${envVar}`);
        }
    });
    return {
        PORT: process.env.PORT,
        APP_NAME: process.env.APP_NAME,
        DB_URI: process.env.DB_URI,
        NODE_ENV: process.env.NODE_ENV,
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
        JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
        JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        JWT_RESET_PASSWORD_TOKEN_SECRET: process.env.JWT_RESET_PASSWORD_TOKEN_SECRET,
        JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN: process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN,
        CLIENT_URL: process.env.CLIENT_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_FROM: process.env.SMTP_FROM,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT
    };
};
exports.envVars = loadEnv();
