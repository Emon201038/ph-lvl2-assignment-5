import Parcel from "./parcel.model";
import { generateTrackingId } from "../../utils/tracking";
import { isValidObjectId, Types } from "mongoose";
import AppError from "../../helpers/appError";
import { HTTP_STATUS } from "../../utils/httpStatus";
import {
  CreateParcelSchemaType,
  UpdateParcelStatusSchemaType,
} from "./parcel.validation";
import { ParcelStatus } from "./parcel.interface";
import { calculateDeliveryFee } from "../../utils/calculateDeliveryFee";
import { JwtPayload } from "../../utils/jwt";
import { QueryBuilder } from "../../utils/queryBuilder";
import User from "../user/user.model";
import { getExpectedDeliveryDate } from "../../utils/calculateExpectedDate";

// ✅
const createParcel = async (
  data: CreateParcelSchemaType,
  initiator: string
) => {
  const receiver = await User.findOne({ email: data.receiverEmail });
  if (!receiver)
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      "receiver not found with this email."
    );

  if (receiver._id.toString() === initiator)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "You cannot send parcel to yourself."
    );

  if (receiver.isBlocked)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "receiver is blocked. You cannot send parcel to this user."
    );

  if (receiver.isDeleted)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "receiver is deleted. You cannot send parcel to this user."
    );

  if (!receiver.isVerified)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "receiver is not verified. You cannot send parcel to this user."
    );
  // Calculate delivery fee
  const deliveryFee = calculateDeliveryFee({
    deliveryCity: data.deliveryInfo.deliveryAddress.city,
    deliveryType: data.deliveryInfo.deliveryType,
    pickupCity: data.deliveryInfo.pickupAddress.city,
    weight: data.packageDetails.weight,
  });

  // Build parcel structure
  const parcelData = {
    trackingId: generateTrackingId(),
    sender: new Types.ObjectId(initiator),
    receiver: receiver._id,
    initiatedBy: new Types.ObjectId(initiator),
    ...data,
    deliveryInfo: {
      ...data.deliveryInfo,
      pickupDate: new Date(),
      expectedDeliveryDate: getExpectedDeliveryDate(
        data.deliveryInfo.deliveryType
      ),
      currentLocation: {
        type: "Point",
        coordinates: [0, 0],
        address: data.deliveryInfo.pickupAddress.address || "",
      },
    },
    statusLogs: [
      {
        status: ParcelStatus.PENDING,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(initiator),
        note: "Parcel created and waiting for approval",
      },
    ],
    paymentInfo: {
      ...data.paymentInfo,
      deleveryFee: deliveryFee,
    },
  };

  const sender = await User.findOne({ _id: initiator });
  if (!sender) throw new AppError(HTTP_STATUS.NOT_FOUND, "Sender not found.");

  // Create Parcel
  const parcel = await Parcel.create(parcelData);
  receiver.parcels.push(parcel._id);
  sender.parcels.push(parcel._id);

  await receiver.save();
  await sender.save();

  return parcel;
};

// ✅
const getUserParcels = async (
  userId: string,
  query: Record<string, string>
) => {
  const builder = new QueryBuilder<typeof Parcel.prototype>(Parcel, query);
  const res = await builder
    .filter()
    .search([
      "trackingId",
      "deliveryInfo.deliveryAddress.phone",
      "deliveryInfo.pickupAddress.phone",
      "deliveryInfo.deliveryAddress.name",
      "deliveryInfo.pickupAddress.name",
    ])
    .sort()
    .paginate()
    .populate()
    .execWithMeta();
  return { parcels: res.data, meta: res.meta };
};

// ✅
const getAllParcels = async (quries: Record<string, string>) => {
  const builder = new QueryBuilder<typeof Parcel.prototype>(Parcel, quries);
  const res = await builder
    .filter()
    .search(["trackingId", "deliveryInfo.deliveryAddress.phone"])
    .paginate()
    .populate()
    .execWithMeta();
  return { parcels: res.data, meta: res.meta };
};

// ✅
const cancelParcel = async (parcelId: string, note: string, userId: string) => {
  const parcel = await Parcel.findOne({
    _id: parcelId,
    $or: [{ sender: userId }, { receiver: userId }, { initiatedBy: userId }],
  });
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");
  if (![ParcelStatus.PENDING, ParcelStatus.APPROVED].includes(parcel.status))
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Parcel can't be canceled. Parcel is already " + parcel.status
    );
  parcel.status = ParcelStatus.CANCELED;
  parcel.statusLogs.push({
    status: ParcelStatus.CANCELED,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(userId),
    note,
  });
  return parcel.save();
};

// ✅
const getSingleParcel = async (parcelId: string) => {
  let parcel;
  if (parcelId.startsWith("TRK-")) {
    parcel = await Parcel.findOne({ trackingId: parcelId });
  } else if (isValidObjectId(parcelId)) {
    parcel = await Parcel.findOne({ _id: parcelId });
  }
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");

  return parcel;
};

// ✅
const deleteParcel = async (parcelId: string) => {
  const parcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { isDeleted: true },
    { new: true, runValidators: true }
  );
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");

  return parcel;
};

// ✅
const updateStatus = async (
  parcelId: string,
  data: UpdateParcelStatusSchemaType,
  user: JwtPayload
) => {
  const parcel = await Parcel.findOne({ _id: parcelId });
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");
  if (parcel.status === data.status && !data.note)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Parcel status can't be same. Please add note if you want to update same status."
    );
  if (parcel.isDeleted)
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Parcel is deleted");
  if (
    parcel.status === ParcelStatus.RETURNED ||
    parcel.status === ParcelStatus.CANCELED
  )
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Parcel can't be updated. Parcel is already " + parcel.status
    );
  parcel.status = data.status;
  parcel.statusLogs.push({
    status: data.status,
    timestamp: data.timestamp || new Date(),
    updatedBy: new Types.ObjectId(user.userId),
    note: data.note,
  });
  return await parcel.save();
};

// ✅
const confirmParcel = async (
  parcelId: string,
  note: string,
  user: JwtPayload
) => {
  const parcel = await Parcel.findOne({ _id: parcelId });
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");
  if (
    [
      ParcelStatus.PENDING,
      ParcelStatus.RETURNED,
      ParcelStatus.CANCELED,
      ParcelStatus.FAILED,
      ParcelStatus.RETURNED_INITIATED,
      ParcelStatus.RETURNED_IN_TRANSIT,
    ].includes(parcel.status)
  )
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Parcel can't be confirmed. Parcel is " + parcel.status
    );
  parcel.status = ParcelStatus.APPROVED;
  parcel.statusLogs.push({
    status: ParcelStatus.APPROVED,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(user.userId),
    note,
  });
  return await parcel.save();
};

// ✅
const blockParcel = async (
  parcelId: string,
  note: string,
  user: JwtPayload
) => {
  const parcel = await Parcel.findOne({ _id: parcelId });
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");
  if (parcel.isBlocked)
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Parcel is already blocked");
  parcel.isBlocked = true;
  parcel.statusLogs.push({
    status: ParcelStatus.BLOCKED,
    timestamp: new Date(),
    note,
    updatedBy: new Types.ObjectId(user.userId),
  });
  return await parcel.save();
};
// ✅
const getSenderParcels = async (
  query: Record<string, string>,
  user: JwtPayload
) => {
  const builder = new QueryBuilder<typeof Parcel.prototype>(Parcel, {
    ...query,
    sender: user.userId,
  });
  const res = await builder
    .filter()
    .search(["paymentInfo.method", "paymentInfo.status", "status"])
    .paginate()
    .populate(["receiver", "sender"])
    .execWithMeta();

  return { parcels: res.data, meta: res.meta };
};

// ✅
const myParcels = async (query: Record<string, string>, user: JwtPayload) => {
  const role = user.role.toLowerCase();
  const builder = new QueryBuilder<typeof Parcel.prototype>(Parcel, {
    ...query,
    [role]: user.userId,
  });
  const res = await builder
    .filter()
    .search(["paymentInfo.method", "paymentInfo.status", "status"])
    .paginate()
    .execWithMeta();
  return { parcels: res.data, meta: res.meta };
};

// ✅
const getReceiverParcels = async (
  query: Record<string, string>,
  user: JwtPayload
) => {
  const builder = new QueryBuilder<typeof Parcel.prototype>(Parcel, {
    ...query,
    receiver: user.userId,
  });
  const res = await builder
    .filter()
    .search(["paymentInfo.method", "paymentInfo.status", "status"])
    .paginate()
    .execWithMeta();

  return { parcels: res.data, meta: res.meta };
};

// ✅
const trackParcel = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId: trackingId })
    .select("statusLogs -_id")
    .populate({
      path: "statusLogs.updatedBy",
      select: "name -_id picture",
      options: { strictPopulate: false },
    });
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");
  return parcel;
};

// ✅
const returnParcel = async (
  parcelId: string,
  note: string,
  user: JwtPayload
) => {
  const parcel = await Parcel.findOne({ _id: parcelId });
  if (!parcel) throw new AppError(HTTP_STATUS.NOT_FOUND, "Parcel not found");
  if (parcel.status !== ParcelStatus.DELIVERED)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Parcel can't be returned. Parcel is not delivered yet."
    );
  parcel.status = ParcelStatus.RETURNED_INITIATED;
  parcel.statusLogs.push({
    status: ParcelStatus.RETURNED_INITIATED,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(user.userId),
    note,
  });
  return await parcel.save();
};

export const ParcelService = {
  createParcel,
  getUserParcels,
  getAllParcels,
  cancelParcel,
  getSingleParcel,
  deleteParcel,
  updateStatus,
  confirmParcel,
  returnParcel,
  blockParcel,
  getSenderParcels,
  getReceiverParcels,
  trackParcel,
  myParcels,
};
