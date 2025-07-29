import dotenv from "dotenv";

dotenv.config();

interface IEnvVars {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
  CLIENT_URL: string;
};

const loadEnv = (): IEnvVars => {
  const requiredEnv = [
    "PORT",
    "DB_URI",
    "NODE_ENV"];

  requiredEnv.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "access-token-secret",
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "1d",
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "refresh-token-secret",
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  };
};

export const envVars = loadEnv();