"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parcel_controller_1 = require("./parcel.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const parcel_validation_1 = require("./parcel.validation");
const parcelRouter = (0, express_1.Router)();
parcelRouter
    .route("/")
    .post((0, checkAuth_1.checkAuth)(user_interface_1.UserRole.SENDER, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.createParcelSchema), parcel_controller_1.ParcelController.create)
    .get((0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.allParcels);
parcelRouter.get("/sender", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.SENDER, user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.listUserParcels);
parcelRouter.get("/receiver", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.RECEIVER, user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.listUserParcels);
parcelRouter.patch("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.SENDER), parcel_controller_1.ParcelController.cancel);
parcelRouter.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.block);
parcelRouter.patch("/confirm/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.RECEIVER, user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.confirm);
parcelRouter.patch("/return/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.RECEIVER, user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.returnParcel);
parcelRouter.patch("/update-status/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.updateParcelStatusSchema), parcel_controller_1.ParcelController.updateStatus);
parcelRouter.get("/tracking/:trackingId", parcel_controller_1.ParcelController.trackParcel);
parcelRouter.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), parcel_controller_1.ParcelController.myParcels);
parcelRouter
    .route("/:id")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.getSingleParcel)
    .delete((0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), parcel_controller_1.ParcelController.deleteParcel);
exports.default = parcelRouter;
