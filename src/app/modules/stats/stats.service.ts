import { subDays } from "date-fns";
import User from "../user/user.model";
import Parcel from "../parcel/parcel.model";

const usersStats = async () => {
  const now = new Date();

  const [
    activeUsers,
    last7daysUsers,
    last30daysUsers,
    usersByRole,
    blockedUsers,
    verifiedUsers,
    unverifiedUsers,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ createdAt: { $gte: subDays(now, 7) } }),
    User.countDocuments({ createdAt: { $gte: subDays(now, 30) } }),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    User.countDocuments({ isBlocked: true }),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ isVerified: false }),
  ]);

  return {
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
  };
};

export const StatsService = {
  usersStats,
  parcelsStats,
};
