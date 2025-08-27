import { subDays } from "date-fns";
import User from "../user/user.model";
import Parcel from "../parcel/parcel.model";
import { ParcelStatus } from "../parcel/parcel.interface";

const usersStats = async () => {
  const now = new Date();

  const [
    totalUsers,
    activeUsers,
    last7daysUsers,
    last30daysUsers,
    usersByRole,
    blockedUsers,
    verifiedUsers,
    unverifiedUsers,
  ] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({
      isBlocked: false,
      isDeleted: false,
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
    User.countDocuments({ createdAt: { $gte: subDays(now, 7) } }),
    User.countDocuments({ createdAt: { $gte: subDays(now, 30) } }),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    User.countDocuments({ isBlocked: true }),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ isVerified: false }),
  ]);

  return {
    totalUsers,
    activeUsers,
    last7daysUsers,
    last30daysUsers,
    usersByRole: usersByRole.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {} as Record<string, number>),
    blockedUsers,
    verifiedUsers,
    unverifiedUsers,
  };
};
const parcelsStats = async () => {
  const [
    allParcel,
    parcelByStatus,
    parcelByPaymentMethod,
    parcelByPaymentStatus,
    blockedParcels,
    deletedParcels,
    senderWithMostParcels,
    receiverWithMostParcels,
    totalRevinue,
  ] = await Promise.all([
    Parcel.countDocuments({}),
    Parcel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Parcel.aggregate([
      { $group: { _id: "$paymentInfo.method", count: { $sum: 1 } } },
    ]),
    Parcel.aggregate([
      { $group: { _id: "$paymentInfo.status", count: { $sum: 1 } } },
    ]),
    Parcel.countDocuments({ isBlocked: true }),
    Parcel.countDocuments({ isDeleted: true }),
    Parcel.aggregate([
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
    Parcel.aggregate([
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
    Parcel.aggregate([
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
    }, {} as Record<string, number>),
    parcelByPaymentMethod: parcelByPaymentMethod.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {} as Record<string, number>),
    parcelByPaymentStatus: parcelByPaymentStatus.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {} as Record<string, number>),
    blockedParcels,
    deletedParcels,
    mostSender: senderWithMostParcels.length ? senderWithMostParcels[0] : null,
    mostReceiver: receiverWithMostParcels.length
      ? receiverWithMostParcels[0]
      : null,
    totalRevinue: totalRevinue.length ? totalRevinue[0].count : 0,
    monthlyRevinue: (totalRevinue.length ? totalRevinue[0].count : 0) / 12,
  };
};

const monthlyReport = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const usersAgg = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, isDeleted: false } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        users: { $sum: 1 },
      },
    },
  ]);

  const parcelsAgg = await Parcel.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, isDeleted: false } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        parcels: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [
              { $eq: ["$status", ParcelStatus.DELIVERED] },
              "$paymentInfo.deleveryFee",
              0,
            ],
          },
        },
      },
    },
  ]);

  const userMap = new Map(
    usersAgg.map((u) => [`${u._id.year}-${u._id.month}`, u.users])
  );
  const parcelMap = new Map(
    parcelsAgg.map((p) => [`${p._id.year}-${p._id.month}`, p])
  );

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
  const results: {
    month: string;
    users: number;
    parcels: number;
    revenue: number;
  }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

    results.push({
      month: months[d.getMonth()],
      users: userMap.get(key) ?? 0,
      parcels: parcelMap.get(key)?.parcels ?? 0,
      revenue: parcelMap.get(key)?.revenue ?? 0,
    });
  }

  return results;
};

export const StatsService = {
  usersStats,
  parcelsStats,
  monthlyReport,
};
