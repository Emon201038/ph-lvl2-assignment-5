/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ParcelService } from "./parcel.service";
import { JwtPayload } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../helpers/appError";
import { HTTP_STATUS } from "../../utils/httpStatus";

const create = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload;
  const parcel = await ParcelService.createParcel(req.body, user.userId);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Parcel created successfully.",
    data: parcel,
  });
};

const allParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcels retrieved successfully.",
      data: await ParcelService.getAllParcels(
        req.query as Record<string, string>
      ),
    });
  }
);

const listUserParcels = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const parcels = await ParcelService.getUserParcels(
    user.userId,
    req.query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parcels retrieved successfully.",
    data: parcels,
  });
};

const cancel = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const parcel = await ParcelService.cancelParcel(
    req.params.id,
    req.body.note,
    user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parcel canceled successfully.",
    data: parcel,
  });
};

const getSingleParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel retrieved successfully.",
      data: await ParcelService.getSingleParcel(req.params.id),
    });
  }
);

const deleteParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel deleted successfully.",
      data: await ParcelService.deleteParcel(req.params.id),
    });
  }
);

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel status updated successfully.",
      data: await ParcelService.updateStatus(
        req.params.id,
        req.body,
        req.user as JwtPayload
      ),
    });
  }
);

const confirm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel confirmed successfully.",
      data: await ParcelService.confirmParcel(
        req.params.id,
        req.body.note,
        req.user as JwtPayload
      ),
    });
  }
);

const block = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel blocked successfully.",
      data: await ParcelService.blockParcel(
        req.params.id,
        req.body.note,
        req.user as JwtPayload
      ),
    });
  }
);

const senderParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Sender parcels retrieved successfully.",
      data: await ParcelService.getSenderParcels(
        req.query as Record<string, string>,
        req.user as JwtPayload
      ),
    });
  }
);

const receiverParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Receiver parcels retrieved successfully.",
      data: await ParcelService.getReceiverParcels(
        req.query as Record<string, string>,
        req.user as JwtPayload
      ),
    });
  }
);

const trackParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel tracked successfully.",
      data: await ParcelService.trackParcel(req.params.trackingId),
    });
  }
);

const returnParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || !req.body.note)
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Note is required to return parcel."
      );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Parcel returned successfully.",
      data: await ParcelService.returnParcel(
        req.params.id,
        req.body.note,
        req.user as JwtPayload
      ),
    });
  }
);

const myParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "My parcels retrieved successfully.",
      data: await ParcelService.myParcels(
        req.query as Record<string, string>,
        req.user as JwtPayload
      ),
    });
  }
);

export const ParcelController = {
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
