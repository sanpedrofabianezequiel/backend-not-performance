"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextDate = exports.createStringFromDate = exports.createDateFromString = void 0;
var moment_1 = __importDefault(require("moment"));
var createDateFromString = function (input) {
    return (0, moment_1.default)(input, "YYYY-MM-DD").toDate();
};
exports.createDateFromString = createDateFromString;
var createStringFromDate = function (date) {
    return (0, moment_1.default)(date).format("YYYY-MM-DD");
};
exports.createStringFromDate = createStringFromDate;
var getNextDate = function (dateString, daysString) {
    // "2021-04-23"
    var date = (0, exports.createDateFromString)(dateString);
    var currentDay = date.getDay();
    //console.log('currentDay::: ', currentDay);
    var days = daysString.split('');
    //console.log(days)
    var index = days.indexOf("".concat(currentDay));
    //console.log("index :" + index)
    var daysToAdd = 0;
    //console.log("days-lenght" + days.length)
    if (index == days.length - 1) {
        daysToAdd = 7 - (currentDay - Number(days[0]));
    }
    else {
        daysToAdd = Number(days[index + 1]) - currentDay;
    }
    var nextDate = (0, moment_1.default)(date).add(daysToAdd, "days").format("YYYY-MM-DD");
    return nextDate;
};
exports.getNextDate = getNextDate;
