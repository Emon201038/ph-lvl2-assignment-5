"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpectedDeliveryDate = void 0;
const getExpectedDeliveryDate = (deliveryType) => {
    const expectedDeliveryDate = new Date();
    if (deliveryType === "STANDARD") {
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);
    }
    else if (deliveryType === "EXPRESS") {
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 2);
    }
    else {
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);
    }
    return expectedDeliveryDate;
};
exports.getExpectedDeliveryDate = getExpectedDeliveryDate;
