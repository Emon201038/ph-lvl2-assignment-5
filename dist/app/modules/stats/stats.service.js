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
exports.StatsService = void 0;
const date_fns_1 = require("date-fns");
const user_model_1 = __importDefault(require("../user/user.model"));
const parcel_model_1 = __importDefault(require("../parcel/parcel.model"));
const usersStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const [totalUsers, activeUsers, last7daysUsers, last30daysUsers, usersByRole, blockedUsers, verifiedUsers, unverifiedUsers,] = yield Promise.all([
        user_model_1.default.countDocuments({ isDeleted: false }),
        user_model_1.default.countDocuments({
            isBlocked: false,
            isDeleted: false,
            lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
        user_model_1.default.countDocuments({ createdAt: { $gte: (0, date_fns_1.subDays)(now, 7) } }),
        user_model_1.default.countDocuments({ createdAt: { $gte: (0, date_fns_1.subDays)(now, 30) } }),
        user_model_1.default.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
        user_model_1.default.countDocuments({ isBlocked: true }),
        user_model_1.default.countDocuments({ isVerified: true }),
        user_model_1.default.countDocuments({ isVerified: false }),
    ]);
    return {
        totalUsers,
        activeUsers,
        last7daysUsers,
        last30daysUsers,
        usersByRole: usersByRole.reduce((acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        }, {}),
        blockedUsers,
        verifiedUsers,
        unverifiedUsers,
    };
});
const parcelsStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [allParcel, parcelByStatus, parcelByPaymentMethod, parcelByPaymentStatus, blockedParcels, deletedParcels, senderWithMostParcels, receiverWithMostParcels, totalRevinue,] = yield Promise.all([
        parcel_model_1.default.countDocuments({}),
        parcel_model_1.default.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        parcel_model_1.default.aggregate([
            { $group: { _id: "$paymentInfo.method", count: { $sum: 1 } } },
        ]),
        parcel_model_1.default.aggregate([
            { $group: { _id: "$paymentInfo.status", count: { $sum: 1 } } },
        ]),
        parcel_model_1.default.countDocuments({ isBlocked: true }),
        parcel_model_1.default.countDocuments({ isDeleted: true }),
        parcel_model_1.default.aggregate([
            {
                $match: {
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: "$sender",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "senderDetails",
                },
            },
            {
                $unwind: "$senderDetails",
            },
            {
                $project: {
                    _id: "$senderDetails._id",
                    name: "$senderDetails.name",
                    email: "$senderDetails.email",
                    phone: "$senderDetails.phone",
                    picture: "$senderDetails.picture",
                    count: 1,
                },
            },
        ]),
        parcel_model_1.default.aggregate([
            {
                $match: {
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: "$receiver",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "receiverDetails",
                },
            },
            {
                $unwind: "$receiverDetails",
            },
            {
                $project: {
                    _id: "$receiverDetails._id",
                    name: "$receiverDetails.name",
                    email: "$receiverDetails.email",
                    phone: "$receiverDetails.phone",
                    picture: "$receiverDetails.picture",
                    count: 1,
                },
            },
        ]),
        parcel_model_1.default.aggregate([
            {
                $match: {
                    status: "DELIVERED",
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$paymentInfo.deleveryFee" },
                },
            },
        ]),
    ]);
    return {
        allParcel,
        parcelByStatus: parcelByStatus.reduce((acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        }, {}),
        parcelByPaymentMethod: parcelByPaymentMethod.reduce((acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        }, {}),
        parcelByPaymentStatus: parcelByPaymentStatus.reduce((acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        }, {}),
        blockedParcels,
        deletedParcels,
        mostSender: senderWithMostParcels.length ? senderWithMostParcels[0] : null,
        mostReceiver: receiverWithMostParcels.length
            ? receiverWithMostParcels[0]
            : null,
        totalRevinue: totalRevinue.length ? totalRevinue[0].count : 0,
        monthlyRevinue: (totalRevinue.length ? totalRevinue[0].count : 0) / 12,
    };
});
exports.StatsService = {
    usersStats,
    parcelsStats,
};
