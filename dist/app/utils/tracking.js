"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingId = void 0;
const generateTrackingId = () => {
    const date = new Date();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let trackingId = 'TRK-';
    trackingId += date.getFullYear().toString().padStart(4, '0');
    trackingId += (date.getMonth() + 1).toString().padStart(2, '0');
    trackingId += date.getDate().toString().padStart(2, '0');
    trackingId += '-';
    for (let i = 0; i < 6; i++) {
        trackingId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    ;
    return trackingId;
};
exports.generateTrackingId = generateTrackingId;
