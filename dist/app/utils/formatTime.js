"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimeString = void 0;
const formatTimeString = (input) => {
    const regex = /^(\d+)([smhd])?$/;
    const unitMap = {
        s: 'second',
        m: 'minute',
        h: 'hour',
        d: 'day',
        undefined: 'millisecond' // default if no unit
    };
    const match = input.trim().match(regex);
    if (!match) {
        throw new Error(`Invalid time format: "${input}"`);
    }
    const value = parseInt(match[1], 10);
    const unitKey = match[2];
    const baseUnit = unitMap[unitKey];
    const unit = value === 1 ? baseUnit : `${baseUnit}s`;
    return `${value} ${unit}`;
};
exports.formatTimeString = formatTimeString;
