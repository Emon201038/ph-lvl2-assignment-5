import Parcel from "./parcel.model";
import { generateTrackingId } from "../../utils/tracking";
import { Types } from "mongoose";
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

// ✅
const createParcel = async (
  data: CreateParcelSchemaType,
  initiator: string
) => {
  const {
    sender,
    receiver,
    paymentMethod,
    paymentStatus,
    paymentAmount,
    weight,
    length,
    width,
    height,
    description,
    pickupDate,
    expectedDeliveryDate,
    deliveryType,
    pickupCity,
    pickupAddress,
    deliveryCity,
    deliveryAddress,
    deliveryPhone,
    currentLocationLat,
    currentLocationLng,
    currentLocationAddress,
    itemNames = [],
    itemQuantities = [],
    itemValues = [],
    images = [],
  } = data;

  // Calculate delivery fee
  const deliveryFee = calculateDeliveryFee({
    deliveryCity,
    deliveryType,
    pickupCity,
    weight,
  });

  // Build parcel structure
  const parcelData = {
    trackingId: generateTrackingId(),
    sender,
    receiver,
    initiatedBy: new Types.ObjectId(initiator),
    paymentInfo: {
      method: paymentMethod,
      status: paymentStatus,
      amount: paymentAmount,
      deleveryFee: deliveryFee,
    },
    packageDetails: {
      weight,
      dimensions: {
        length,
        width,
        height,
      },
      description,
      items: itemNames.map((name, idx) => ({
        name,
        quantity: itemQuantities[idx] || 1,
        value: itemValues[idx] || 0,
      })),
      images,
    },
    deliveryInfo: {
      pickupDate,
      expectedDeliveryDate,
      deliveryType,
      pickupAddress: {
        city: pickupCity,
        address: pickupAddress,
      },
      deliveryAddress: {
        city: deliveryCity,
        address: deliveryAddress,
        phone: deliveryPhone,
      },
      currentLocation: {
        type: "Point",
        coordinates: [currentLocationLng || 0, currentLocationLat || 0],
        address: currentLocationAddress || "",
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
  };

  // Create Parcel
  const parcel = await Parcel.create(parcelData);

  return parcel;
};

// ✅
const getUserParcels = async (userId: string) => {
  const builder = new QueryBuilder<typeof Parcel.prototype>(Parcel, {
    receiver: userId,
    sender: userId,
    initiatedBy: userId,
  });
  const res = await builder
    .filter()
    .search([
      "paymentInfo.method",
      "paymentInfo.status",
      "status",
      "statusLogs.status",
      // "sender",
      // "receiver",
    ])
    .sort()
    .paginate()
    .execWithMeta();
  return { parcels: res.data, meta: res.meta };
};

// ✅
const getAllParcels = async (quries: Record<string, string>) => {
  const builder = new QueryBuilder<typeof Parcel.prototype>(Parcel, quries);
  const res = await builder.filter().paginate().execWithMeta();
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
  const parcel = await Parcel.findOne({ _id: parcelId });
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
