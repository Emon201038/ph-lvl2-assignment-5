"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const StatusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: parcel_interface_1.ParcelStatus,
        required: true,
    },
    location: String,
    note: String,
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now },
}, {
    versionKey: false,
});
const ParcelSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender is required"],
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            enum: Object.values(parcel_interface_1.DeliveryType),
            default: parcel_interface_1.DeliveryType.STANDARD,
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
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.PENDING,
    },
    statusLogs: [StatusLogSchema],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Review" }],
    initiatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Initiated by is required"],
    },
    deliveryAttempt: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const Parcel = (0, mongoose_1.model)("Parcel", ParcelSchema);
exports.default = Parcel;
