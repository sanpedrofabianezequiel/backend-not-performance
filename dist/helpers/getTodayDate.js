"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDateFromString = exports.createStringFromDate = void 0;
var moment_1 = __importDefault(require("moment"));
var createStringFromDate = function (date) {
    return (0, moment_1.default)(date).format("YYYY-MM-DD");
};
exports.createStringFromDate = createStringFromDate;
var createDateFromString = function (input) {
    return (0, moment_1.default)(input, "YYYY-MM-DD").toDate();
};
exports.createDateFromString = createDateFromString;
