import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createParcelSchema,
  updateParcelStatusSchema,
} from "./parcel.validation";

const parcelRouter = Router();

parcelRouter
  .route("/")
  .post(
    checkAuth(UserRole.SENDER, UserRole.ADMIN),
    validateRequest(createParcelSchema),
    ParcelController.create
  )
  .get(checkAuth(UserRole.ADMIN), ParcelController.allParcels);

parcelRouter.get(
  "/sender",
  checkAuth(UserRole.SENDER, UserRole.ADMIN),
  ParcelController.listUserParcels
);
parcelRouter.get(
  "/receiver",
  checkAuth(UserRole.RECEIVER, UserRole.ADMIN),
  ParcelController.listUserParcels
);

parcelRouter.patch(
  "/cancel/:id",
  checkAuth(UserRole.SENDER),
  ParcelController.cancel
);

parcelRouter.patch(
  "/block/:id",
  checkAuth(UserRole.ADMIN),
  ParcelController.block
);

parcelRouter.patch(
  "/confirm/:id",
  checkAuth(UserRole.RECEIVER, UserRole.ADMIN),
  ParcelController.confirm
);

parcelRouter.patch(
  "/return/:id",
  checkAuth(UserRole.RECEIVER, UserRole.ADMIN),
  ParcelController.returnParcel
);

parcelRouter.patch(
  "/update-status/:id",
  checkAuth(UserRole.ADMIN),
  validateRequest(updateParcelStatusSchema),
  ParcelController.updateStatus
);

parcelRouter.get("/tracking/:trackingId", ParcelController.trackParcel);

parcelRouter.get(
  "/me",
  checkAuth(...Object.values(UserRole)),
  ParcelController.myParcels
);

parcelRouter
  .route("/:id")
  .get(checkAuth(UserRole.ADMIN), ParcelController.getSingleParcel)
  .delete(checkAuth(UserRole.ADMIN), ParcelController.deleteParcel);

export default parcelRouter;
