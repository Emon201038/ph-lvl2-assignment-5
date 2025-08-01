"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusSchema = exports.createParcelSchema = exports.PaymentStatusEnum = exports.PaymentMethodEnum = exports.DeliveryTypeEnum = exports.ParcelStatusEnum = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
// Enums
exports.ParcelStatusEnum = zod_1.z.enum(Object.values(parcel_interface_1.ParcelStatus));
exports.DeliveryTypeEnum = zod_1.z.enum(["STANDARD", "EXPRESS"]);
exports.PaymentMethodEnum = zod_1.z.enum(["COD", "ONLINE"]);
exports.PaymentStatusEnum = zod_1.z.enum(["PAID", "UNPAID"]);
exports.createParcelSchema = zod_1.z.object({
    // Required flat fields
    sender: zod_1.z.string({ error: "Sender ID is required" }),
    receiver: zod_1.z.string({ error: "Receiver ID is required" }),
    paymentMethod: exports.PaymentMethodEnum,
    paymentStatus: exports.PaymentStatusEnum,
    paymentAmount: zod_1.z.number({ error: "Payment amount is required" }),
    weight: zod_1.z.number({ error: "Weight is required" }),
    length: zod_1.z.number().optional(),
    width: zod_1.z.number().optional(),
    height: zod_1.z.number().optional(),
    description: zod_1.z.string().optional(),
    pickupDate: zod_1.z.coerce.date(),
    expectedDeliveryDate: zod_1.z.coerce.date(),
    deliveryType: exports.DeliveryTypeEnum.default("STANDARD"),
    pickupCity: zod_1.z.string({ error: "Pickup city is required" }),
    pickupAddress: zod_1.z.string({ error: "Pickup address is required" }),
    deliveryCity: zod_1.z.string({ error: "Delivery city is required" }),
    deliveryAddress: zod_1.z.string({ error: "Delivery address is required" }),
    deliveryPhone: zod_1.z.string({ error: "Delivery phone is required" }),
    currentLocationAddress: zod_1.z.string().optional(),
    currentLocationLat: zod_1.z.number().optional(), // coordinates[1]
    currentLocationLng: zod_1.z.number().optional(), // coordinates[0]
    senderNote: zod_1.z.string().optional(),
    status: exports.ParcelStatusEnum.optional(),
    itemNames: zod_1.z.array(zod_1.z.string()).optional(),
    itemQuantities: zod_1.z.array(zod_1.z.number()).optional(),
    itemValues: zod_1.z.array(zod_1.z.number()).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    reviewIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateParcelStatusSchema = zod_1.z.object({
    status: exports.ParcelStatusEnum,
    location: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    timestamp: zod_1.z.coerce.date().optional(),
});
