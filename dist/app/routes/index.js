"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const otp_routes_1 = __importDefault(require("../modules/otp/otp.routes"));
const parcel_routes_1 = __importDefault(require("../modules/parcel/parcel.routes"));
const stats_routes_1 = __importDefault(require("../modules/stats/stats.routes"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.default,
    },
    {
        path: "/auth",
        route: auth_routes_1.default,
    },
    {
        path: "/otp",
        route: otp_routes_1.default,
    },
    {
        path: "/parcels",
        route: parcel_routes_1.default,
    },
    {
        path: "/stats",
        route: stats_routes_1.default,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
