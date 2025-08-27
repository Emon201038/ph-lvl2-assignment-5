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
    receiverEmail: zod_1.z
        .string({ message: "Receiver Email is required" })
        .email({ message: "Enter valid email" }),
    packageDetails: zod_1.z.object({
        weight: zod_1.z.coerce
            .number({ error: "Weight is required" })
            .positive()
            .min(0.5, "Weight must be at least 0.5kg")
            .max(50, "Weight must be less than 50kg"),
        dimensions: zod_1.z.object({
            length: zod_1.z.coerce
                .number({ error: "Length is required" })
                .positive()
                .min(1, "Length must be at least 1cm")
                .max(100, "Length must be less than 100cm")
                .optional(),
            width: zod_1.z.coerce
                .number({ error: "Width is required" })
                .positive()
                .min(1, "Width must be at least 1cm")
                .max(100, "Width must be less than 100cm")
                .optional(),
            height: zod_1.z.coerce
                .number({ error: "Height is required" })
                .positive()
                .min(1, "Height must be at least 1cm")
                .max(100, "Height must be less than 100cm")
                .optional(),
        }),
        type: zod_1.z.enum(["DOCUMENT", "PHYSICAL"]).default("PHYSICAL"),
        description: zod_1.z.string().optional(),
    }),
    deliveryInfo: zod_1.z.object({
        deliveryAddress: zod_1.z.object({
            state: zod_1.z
                .string({ message: " state is required" })
                .min(1, "Select a state"),
            city: zod_1.z.string({ message: " city is required" }).min(1, "Select a city"),
            area: zod_1.z.string({ message: " area is required" }).min(1, "Select a area"),
            address: zod_1.z
                .string({ message: "Full Address is required" })
                .min(1, "Enter full address"),
            phone: zod_1.z
                .string({ message: "Phone number is required" })
                .min(1, "Enter phone number"),
            name: zod_1.z
                .string({ message: "Receiver name is requred" })
                .min(1, "Required")
                .max(32, "Max 32 characters"),
        }),
        pickupAddress: zod_1.z.object({
            state: zod_1.z
                .string({ message: " state is required" })
                .min(1, "Select a state"),
            city: zod_1.z.string({ message: " city is required" }).min(1, "Select a city"),
            area: zod_1.z.string({ message: " area is required" }).min(1, "Select a area"),
            address: zod_1.z
                .string({ message: "Full Address is required" })
                .min(1, "Enter full address"),
            phone: zod_1.z
                .string({ message: "Phone number is required" })
                .min(1, "Enter phone number"),
            name: zod_1.z
                .string({ message: "Sender name is requred" })
                .min(1, "Required")
                .max(32, "Max 32 characters"),
        }),
        deliveryType: zod_1.z.enum(["STANDARD", "EXPRESS"]).default("STANDARD"),
        senderNote: zod_1.z.string().optional(),
    }),
    paymentInfo: zod_1.z.object({
        method: zod_1.z.enum(["COD", "ONLINE"], { error: "Payment method is required" }),
        status: zod_1.z.enum(["UNPAID", "PAID"], { error: "Payment status is required" }),
        amount: zod_1.z.coerce.number({ message: "Amount is required" }).positive(),
    }),
});
exports.updateParcelStatusSchema = zod_1.z.object({
    status: exports.ParcelStatusEnum,
    location: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    timestamp: zod_1.z.coerce.date().optional(),
});
