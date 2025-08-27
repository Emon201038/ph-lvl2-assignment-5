"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelStatus = exports.PackageType = exports.DeliveryType = void 0;
var DeliveryType;
(function (DeliveryType) {
    DeliveryType["STANDARD"] = "STANDARD";
    DeliveryType["EXPRESS"] = "EXPRESS";
})(DeliveryType || (exports.DeliveryType = DeliveryType = {}));
var PackageType;
(function (PackageType) {
    PackageType["DOCUMENT"] = "DOCUMENT";
    PackageType["PHYSICAL"] = "PHYSICAL";
})(PackageType || (exports.PackageType = PackageType = {}));
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["PENDING"] = "PENDING";
    ParcelStatus["APPROVED"] = "APPROVED";
    ParcelStatus["PICK_UP_REQUESTED"] = "PICK_UP_REQUESTED";
    ParcelStatus["PICKED_UP"] = "PICKED_UP";
    ParcelStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ParcelStatus["AT_HUB"] = "AT_HUB";
    ParcelStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    ParcelStatus["DELIVERY_ATTEMPTED"] = "DELIVERY_ATTEMPTED";
    ParcelStatus["DELIVERED"] = "DELIVERED";
    ParcelStatus["CANCELED"] = "CANCELED";
    ParcelStatus["FAILED"] = "FAILED";
    ParcelStatus["RETURNED_INITIATED"] = "RETURNED_INITIATED";
    ParcelStatus["RETURNED_IN_TRANSIT"] = "RETURNED_IN_TRANSIT";
    ParcelStatus["RETURNED"] = "RETURNED";
    ParcelStatus["ON_HOLD"] = "ON_HOLD";
    ParcelStatus["BLOCKED"] = "BLOCKED";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
