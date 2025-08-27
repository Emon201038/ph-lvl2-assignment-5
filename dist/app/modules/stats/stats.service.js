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
const parcel_interface_1 = require("../parcel/parcel.interface");
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
const monthlyReport = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    const usersAgg = yield user_model_1.default.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, isDeleted: false } },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                users: { $sum: 1 },
            },
        },
    ]);
    const parcelsAgg = yield parcel_model_1.default.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, isDeleted: false } },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                parcels: { $sum: 1 },
                revenue: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", parcel_interface_1.ParcelStatus.DELIVERED] },
                            "$paymentInfo.deleveryFee",
                            0,
                        ],
                    },
                },
            },
        },
    ]);
    const userMap = new Map(usersAgg.map((u) => [`${u._id.year}-${u._id.month}`, u.users]));
    const parcelMap = new Map(parcelsAgg.map((p) => [`${p._id.year}-${p._id.month}`, p]));
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const results = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        results.push({
            month: months[d.getMonth()],
            users: (_a = userMap.get(key)) !== null && _a !== void 0 ? _a : 0,
            parcels: (_c = (_b = parcelMap.get(key)) === null || _b === void 0 ? void 0 : _b.parcels) !== null && _c !== void 0 ? _c : 0,
            revenue: (_e = (_d = parcelMap.get(key)) === null || _d === void 0 ? void 0 : _d.revenue) !== null && _e !== void 0 ? _e : 0,
        });
    }
    return results;
});
exports.StatsService = {
    usersStats,
    parcelsStats,
    monthlyReport,
};
