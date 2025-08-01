"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./app/config/db");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const redis_config_1 = require("./app/config/redis.config");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is running on port ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield startServer();
}))();
process.on("unhandledRejection", (error) => {
    if (server) {
        server.close(() => {
            console.error(error);
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("uncaughtException", (error) => {
    if (server) {
        server.close(() => {
            console.error(error);
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    if (server) {
        server.close();
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT received");
    if (server) {
        server.close();
    }
});
