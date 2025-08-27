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
exports.ParcelController = void 0;
const parcel_service_1 = require("./parcel.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const appError_1 = __importDefault(require("../../helpers/appError"));
const httpStatus_1 = require("../../utils/httpStatus");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const parcel = yield parcel_service_1.ParcelService.createParcel(req.body, user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Parcel created successfully.",
        data: parcel,
    });
});
const allParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcels retrieved successfully.",
        data: yield parcel_service_1.ParcelService.getAllParcels(req.query),
    });
}));
const listUserParcels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const parcels = yield parcel_service_1.ParcelService.getUserParcels(user.userId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcels retrieved successfully.",
        data: parcels,
    });
});
const cancel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const parcel = yield parcel_service_1.ParcelService.cancelParcel(req.params.id, req.body.note, user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel canceled successfully.",
        data: parcel,
    });
});
const getSingleParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel retrieved successfully.",
        data: yield parcel_service_1.ParcelService.getSingleParcel(req.params.id),
    });
}));
const deleteParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel deleted successfully.",
        data: yield parcel_service_1.ParcelService.deleteParcel(req.params.id),
    });
}));
const updateStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel status updated successfully.",
        data: yield parcel_service_1.ParcelService.updateStatus(req.params.id, req.body, req.user),
    });
}));
const confirm = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel confirmed successfully.",
        data: yield parcel_service_1.ParcelService.confirmParcel(req.params.id, req.body.note, req.user),
    });
}));
const block = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel blocked successfully.",
        data: yield parcel_service_1.ParcelService.blockParcel(req.params.id, req.body.note, req.user),
    });
}));
const senderParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Sender parcels retrieved successfully.",
        data: yield parcel_service_1.ParcelService.getSenderParcels(req.query, req.user),
    });
}));
const receiverParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Receiver parcels retrieved successfully.",
        data: yield parcel_service_1.ParcelService.getReceiverParcels(req.query, req.user),
    });
}));
const trackParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel tracked successfully.",
        data: yield parcel_service_1.ParcelService.trackParcel(req.params.trackingId),
    });
}));
const returnParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body || !req.body.note)
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Note is required to return parcel.");
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel returned successfully.",
        data: yield parcel_service_1.ParcelService.returnParcel(req.params.id, req.body.note, req.user),
    });
}));
const myParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "My parcels retrieved successfully.",
        data: yield parcel_service_1.ParcelService.myParcels(req.query, req.user),
    });
}));
exports.ParcelController = {
    create,
    listUserParcels,
    allParcels,
    cancel,
    getSingleParcel,
    deleteParcel,
    updateStatus,
    confirm,
    returnParcel,
    block,
    senderParcels,
    receiverParcels,
    trackParcel,
    myParcels,
};
