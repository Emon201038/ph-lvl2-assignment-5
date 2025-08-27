"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const parcel_model_1 = __importDefault(require("./parcel.model"));
const tracking_1 = require("../../utils/tracking");
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../helpers/appError"));
const httpStatus_1 = require("../../utils/httpStatus");
const parcel_interface_1 = require("./parcel.interface");
const calculateDeliveryFee_1 = require("../../utils/calculateDeliveryFee");
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_model_1 = __importDefault(require("../user/user.model"));
const calculateExpectedDate_1 = require("../../utils/calculateExpectedDate");
// ✅
const createParcel = (data, initiator) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = yield user_model_1.default.findOne({ email: data.receiverEmail });
    if (!receiver)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "receiver not found with this email.");
    if (receiver._id.toString() === initiator)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "You cannot send parcel to yourself.");
    if (receiver.isBlocked)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "receiver is blocked. You cannot send parcel to this user.");
    if (receiver.isDeleted)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "receiver is deleted. You cannot send parcel to this user.");
    if (!receiver.isVerified)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "receiver is not verified. You cannot send parcel to this user.");
    // Calculate delivery fee
    const deliveryFee = (0, calculateDeliveryFee_1.calculateDeliveryFee)({
        deliveryCity: data.deliveryInfo.deliveryAddress.city,
        deliveryType: data.deliveryInfo.deliveryType,
        pickupCity: data.deliveryInfo.pickupAddress.city,
        weight: data.packageDetails.weight,
    });
    // Build parcel structure
    const parcelData = Object.assign(Object.assign({ trackingId: (0, tracking_1.generateTrackingId)(), sender: new mongoose_1.Types.ObjectId(initiator), receiver: receiver._id, initiatedBy: new mongoose_1.Types.ObjectId(initiator) }, data), { deliveryInfo: Object.assign(Object.assign({}, data.deliveryInfo), { pickupDate: new Date(), expectedDeliveryDate: (0, calculateExpectedDate_1.getExpectedDeliveryDate)(data.deliveryInfo.deliveryType), currentLocation: {
                type: "Point",
                coordinates: [0, 0],
                address: data.deliveryInfo.pickupAddress.address || "",
            } }), statusLogs: [
            {
                status: parcel_interface_1.ParcelStatus.PENDING,
                timestamp: new Date(),
                updatedBy: new mongoose_1.Types.ObjectId(initiator),
                note: "Parcel created and waiting for approval",
            },
        ], paymentInfo: Object.assign(Object.assign({}, data.paymentInfo), { deleveryFee: deliveryFee }) });
    const sender = yield user_model_1.default.findOne({ _id: initiator });
    if (!sender)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Sender not found.");
    // Create Parcel
    const parcel = yield parcel_model_1.default.create(parcelData);
    receiver.parcels.push(parcel._id);
    sender.parcels.push(parcel._id);
    yield receiver.save();
    yield sender.save();
    return parcel;
});
// ✅
const getUserParcels = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const builder = new queryBuilder_1.QueryBuilder(parcel_model_1.default, query);
    const res = yield builder
        .filter()
        .search([
        "trackingId",
        "deliveryInfo.deliveryAddress.phone",
        "deliveryInfo.pickupAddress.phone",
        "deliveryInfo.deliveryAddress.name",
        "deliveryInfo.pickupAddress.name",
    ])
        .sort()
        .paginate()
        .populate()
        .execWithMeta();
    return { parcels: res.data, meta: res.meta };
});
// ✅
const getAllParcels = (quries) => __awaiter(void 0, void 0, void 0, function* () {
    const builder = new queryBuilder_1.QueryBuilder(parcel_model_1.default, quries);
    const res = yield builder
        .filter()
        .search(["trackingId", "deliveryInfo.deliveryAddress.phone"])
        .paginate()
        .populate()
        .execWithMeta();
    return { parcels: res.data, meta: res.meta };
});
// ✅
const cancelParcel = (parcelId, note, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.default.findOne({
        _id: parcelId,
        $or: [{ sender: userId }, { receiver: userId }, { initiatedBy: userId }],
    });
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    if (![parcel_interface_1.ParcelStatus.PENDING, parcel_interface_1.ParcelStatus.APPROVED].includes(parcel.status))
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Parcel can't be canceled. Parcel is already " + parcel.status);
    parcel.status = parcel_interface_1.ParcelStatus.CANCELED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.CANCELED,
        timestamp: new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(userId),
        note,
    });
    return parcel.save();
});
// ✅
const getSingleParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    let parcel;
    if (parcelId.startsWith("TRK-")) {
        parcel = yield parcel_model_1.default.findOne({ trackingId: parcelId });
    }
    else if ((0, mongoose_1.isValidObjectId)(parcelId)) {
        parcel = yield parcel_model_1.default.findOne({ _id: parcelId });
    }
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    return parcel;
});
// ✅
const deleteParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.default.findByIdAndUpdate(parcelId, { isDeleted: true }, { new: true, runValidators: true });
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    return parcel;
});
// ✅
const updateStatus = (parcelId, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.default.findOne({ _id: parcelId });
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    if (parcel.status === data.status && !data.note)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Parcel status can't be same. Please add note if you want to update same status.");
    if (parcel.isDeleted)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Parcel is deleted");
    if (parcel.status === parcel_interface_1.ParcelStatus.RETURNED ||
        parcel.status === parcel_interface_1.ParcelStatus.CANCELED)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Parcel can't be updated. Parcel is already " + parcel.status);
    parcel.status = data.status;
    parcel.statusLogs.push({
        status: data.status,
        timestamp: data.timestamp || new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(user.userId),
        note: data.note,
    });
    return yield parcel.save();
});
// ✅
const confirmParcel = (parcelId, note, user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.default.findOne({ _id: parcelId });
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    if ([
        parcel_interface_1.ParcelStatus.PENDING,
        parcel_interface_1.ParcelStatus.RETURNED,
        parcel_interface_1.ParcelStatus.CANCELED,
        parcel_interface_1.ParcelStatus.FAILED,
        parcel_interface_1.ParcelStatus.RETURNED_INITIATED,
        parcel_interface_1.ParcelStatus.RETURNED_IN_TRANSIT,
    ].includes(parcel.status))
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Parcel can't be confirmed. Parcel is " + parcel.status);
    parcel.status = parcel_interface_1.ParcelStatus.APPROVED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.APPROVED,
        timestamp: new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(user.userId),
        note,
    });
    return yield parcel.save();
});
// ✅
const blockParcel = (parcelId, note, user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.default.findOne({ _id: parcelId });
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    if (parcel.isBlocked)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Parcel is already blocked");
    parcel.isBlocked = true;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.BLOCKED,
        timestamp: new Date(),
        note,
        updatedBy: new mongoose_1.Types.ObjectId(user.userId),
    });
    return yield parcel.save();
});
// ✅
const getSenderParcels = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    const builder = new queryBuilder_1.QueryBuilder(parcel_model_1.default, Object.assign(Object.assign({}, query), { sender: user.userId }));
    const res = yield builder
        .filter()
        .search(["paymentInfo.method", "paymentInfo.status", "status"])
        .paginate()
        .populate(["receiver", "sender"])
        .execWithMeta();
    return { parcels: res.data, meta: res.meta };
});
// ✅
const myParcels = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    const role = user.role.toLowerCase();
    const builder = new queryBuilder_1.QueryBuilder(parcel_model_1.default, Object.assign(Object.assign({}, query), { [role]: user.userId }));
    const res = yield builder
        .filter()
        .search(["paymentInfo.method", "paymentInfo.status", "status"])
        .paginate()
        .execWithMeta();
    return { parcels: res.data, meta: res.meta };
});
// ✅
const getReceiverParcels = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    const builder = new queryBuilder_1.QueryBuilder(parcel_model_1.default, Object.assign(Object.assign({}, query), { receiver: user.userId }));
    const res = yield builder
        .filter()
        .search(["paymentInfo.method", "paymentInfo.status", "status"])
        .paginate()
        .execWithMeta();
    return { parcels: res.data, meta: res.meta };
});
// ✅
const trackParcel = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.default.findOne({ trackingId: trackingId })
        .select("statusLogs -_id")
        .populate({
        path: "statusLogs.updatedBy",
        select: "name -_id picture",
        options: { strictPopulate: false },
    });
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    return parcel;
});
// ✅
const returnParcel = (parcelId, note, user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.default.findOne({ _id: parcelId });
    if (!parcel)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Parcel not found");
    if (parcel.status !== parcel_interface_1.ParcelStatus.DELIVERED)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Parcel can't be returned. Parcel is not delivered yet.");
    parcel.status = parcel_interface_1.ParcelStatus.RETURNED_INITIATED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.RETURNED_INITIATED,
        timestamp: new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(user.userId),
        note,
    });
    return yield parcel.save();
});
exports.ParcelService = {
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
