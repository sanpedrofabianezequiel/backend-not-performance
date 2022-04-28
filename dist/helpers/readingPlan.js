"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMarkedDays = void 0;
var sanitizeMarkedDays = function (input) {
    // Remove not allowed values
    var markedDaysArray = input.filter(function (value) { return value >= 0 && value <= 6; });
    // Order
    markedDaysArray.sort();
    return markedDaysArray;
};
exports.sanitizeMarkedDays = sanitizeMarkedDays;
