"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
;
const sendResponse = (res, data) => res
    .status(data.statusCode)
    .json({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
});
exports.sendResponse = sendResponse;
