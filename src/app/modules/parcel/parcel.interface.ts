import { Types } from "mongoose";

export interface IParcelPayment {
  method: "COD" | "ONLINE";
  status: "PAID" | "UNPAID";
  amount: number;
  deleveryFee: number;
  transactionId?: string;
}

export enum DeliveryType {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
}

export enum PackageType {
  DOCUMENT = "DOCUMENT",
  PHYSICAL = "PHYSICAL",
}

export enum ParcelStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PICK_UP_REQUESTED = "PICK_UP_REQUESTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  AT_HUB = "AT_HUB",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERY_ATTEMPTED = "DELIVERY_ATTEMPTED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
  RETURNED_INITIATED = "RETURNED_INITIATED",
  RETURNED_IN_TRANSIT = "RETURNED_IN_TRANSIT",
  RETURNED = "RETURNED",
  ON_HOLD = "ON_HOLD",
  BLOCKED = "BLOCKED",
}

export interface AddressInfo {
  city: string;
  area: string;
  address: string;
  village?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface DeliveryInfo {
  pickupDate: Date;
  expectedDeliveryDate: Date;
  deliveryType: DeliveryType;
  currentLocation?: {
    type: string;
    coordinates: number[];
    address: string;
  };
  pickupAddress: AddressInfo & {
    phone: string;
    name: string;
  };
  deliveryAddress: AddressInfo & {
    phone: string;
    name: string;
  };
  senderNote?: string;
}

export interface packageDetails {
  weight: number;
  type: PackageType;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  images?: string[];
  items?: {
    name: string;
    quantity: number;
  }[];
}

export interface IParcel extends Document {
  trackingId: string;
  status: ParcelStatus;
  weight: number;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  deliveryInfo: DeliveryInfo;
  packageDetails: packageDetails;
  paymentInfo: IParcelPayment;
  statusLogs: IStatusLog[];
  isBlocked: boolean;
  isCanceled: boolean;
  isDeleted: boolean;
  reviews: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  initiatedBy: Types.ObjectId;
  deliveryAttempt: number;
}

export interface IStatusLog {
  status: ParcelStatus;
  timestamp: Date;
  location?: string;
  updatedBy: Types.ObjectId;
  note?: string;
}
