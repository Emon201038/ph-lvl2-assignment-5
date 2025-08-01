import { z } from "zod";
import { ParcelStatus } from "./parcel.interface";

// Enums
export const ParcelStatusEnum = z.enum(Object.values(ParcelStatus));

export const DeliveryTypeEnum = z.enum(["STANDARD", "EXPRESS"]);
export const PaymentMethodEnum = z.enum(["COD", "ONLINE"]);
export const PaymentStatusEnum = z.enum(["PAID", "UNPAID"]);

export const createParcelSchema = z.object({
  // Required flat fields
  sender: z.string({ error: "Sender ID is required" }),
  receiver: z.string({ error: "Receiver ID is required" }),

  paymentMethod: PaymentMethodEnum,
  paymentStatus: PaymentStatusEnum,
  paymentAmount: z.number({ error: "Payment amount is required" }),

  weight: z.number({ error: "Weight is required" }),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  description: z.string().optional(),

  pickupDate: z.coerce.date(),
  expectedDeliveryDate: z.coerce.date(),
  deliveryType: DeliveryTypeEnum.default("STANDARD"),

  pickupCity: z.string({ error: "Pickup city is required" }),
  pickupAddress: z.string({ error: "Pickup address is required" }),

  deliveryCity: z.string({ error: "Delivery city is required" }),
  deliveryAddress: z.string({ error: "Delivery address is required" }),
  deliveryPhone: z.string({ error: "Delivery phone is required" }),

  currentLocationAddress: z.string().optional(),
  currentLocationLat: z.number().optional(), // coordinates[1]
  currentLocationLng: z.number().optional(), // coordinates[0]

  senderNote: z.string().optional(),
  status: ParcelStatusEnum.optional(),

  itemNames: z.array(z.string()).optional(),
  itemQuantities: z.array(z.number()).optional(),
  itemValues: z.array(z.number()).optional(),

  images: z.array(z.string()).optional(),

  reviewIds: z.array(z.string()).optional(),
});

export type CreateParcelSchemaType = z.infer<typeof createParcelSchema>;

export const updateParcelStatusSchema = z.object({
  status: ParcelStatusEnum,
  location: z.string().optional(),
  note: z.string().optional(),
  timestamp: z.coerce.date().optional(),
});

export type UpdateParcelStatusSchemaType = z.infer<
  typeof updateParcelStatusSchema
>;
