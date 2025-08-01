import { Schema, model } from "mongoose";
import {
  DeliveryType,
  IParcel,
  IStatusLog,
  ParcelStatus,
} from "./parcel.interface";

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: ParcelStatus,
      required: true,
    },
    location: String,
    note: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

const ParcelSchema = new Schema<IParcel>(
  {
    trackingId: { type: String, unique: true },
    paymentInfo: {
      method: {
        type: String,
        enum: ["COD", "ONLINE"],
        required: [true, "Payment method is required"],
      },
      status: {
        type: String,
        enum: ["PAID", "UNPAID"],
        required: [true, "Payment status is required"],
      },
      amount: {
        type: Number,
        required: [true, "Payment amount is required"],
      },
      deleveryFee: {
        type: Number,
        required: [true, "Delivery fee is required"],
      },
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    packageDetails: {
      weight: { type: Number, required: true },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      description: String,
      items: [
        {
          name: String,
          quantity: Number,
          value: Number,
        },
      ],
      images: [String],
    },
    deliveryInfo: {
      pickupDate: { type: Date, required: true },
      expectedDeliveryDate: { type: Date, required: true },
      deliveryType: {
        type: String,
        enum: Object.values(DeliveryType),
        default: DeliveryType.STANDARD,
      },
      currentLocation: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
        address: String,
      },
      pickupAddress: {
        city: {
          type: String,
          required: [true, "Pickup City is required"],
        },
        address: {
          type: String,
          required: [true, "Pickup Address is required"],
        },
      },
      deliveryAddress: {
        city: {
          type: String,
          required: [true, "Delivery City is required"],
        },
        address: {
          type: String,
          required: [true, "Delivery Address is required"],
        },
        phone: {
          type: String,
          required: [true, "Delivery phone is required"],
        },
      },
      senderNote: String,
    },
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.PENDING,
    },
    statusLogs: [StatusLogSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Initiated by is required"],
    },
    deliveryAttempt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Parcel = model<IParcel>("Parcel", ParcelSchema);

export default Parcel;
