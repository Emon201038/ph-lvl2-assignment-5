import { CreateParcelSchemaType } from "../modules/parcel/parcel.validation";

export const getExpectedDeliveryDate = (
  deliveryType: CreateParcelSchemaType["deliveryInfo"]["deliveryType"]
) => {
  const expectedDeliveryDate = new Date();
  if (deliveryType === "STANDARD") {
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);
  } else if (deliveryType === "EXPRESS") {
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 2);
  } else {
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);
  }
  return expectedDeliveryDate;
};
