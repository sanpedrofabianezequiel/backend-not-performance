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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readingPlansController = void 0;
var typeorm_1 = require("typeorm");
var reading_plan_entity_1 = require("../entity/reading_plan.entity");
var getTodayDate_1 = require("../helpers/getTodayDate");
var readingPlan_1 = require("../helpers/readingPlan");
var moment_1 = __importDefault(require("moment"));
var email_1 = require("../helpers/email");
var readingPlansController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, days, start_date, end_date, marked_days, oneDay, existEmailReadingPlan, markedDaysSanitized, startDate, endDate, daysPerWeek, flagFirstDay, flagLastDay, numberOfWeeks, extraStartDays, extraEndDays, numberDays, daysInString, amountVerses, amountVersesPerDay, readingPlanCreated, readingPlan, err_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, name_1 = _a.name, email = _a.email, days = _a.days, start_date = _a.start_date, end_date = _a.end_date, marked_days = _a.marked_days;
                oneDay = 24 * 60 * 60 * 1000;
                return [4 /*yield*/, (0, typeorm_1.getRepository)(reading_plan_entity_1.IReadingPlans).findOne({
                        where: {
                            email: email
                        },
                    })];
            case 1:
                existEmailReadingPlan = _b.sent();
                if (existEmailReadingPlan) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            message: "This email is already registered.",
                        })];
                }
                markedDaysSanitized = (0, readingPlan_1.sanitizeMarkedDays)(marked_days);
                startDate = (0, getTodayDate_1.createDateFromString)(start_date);
                endDate = null;
                if (days == "custom") {
                    endDate = (0, getTodayDate_1.createDateFromString)(end_date);
                }
                else {
                    if (isNaN(Number(days)) || days == "") {
                        return [2 /*return*/, res.status(409).json({
                                data: null,
                                message: "Days property is not valid. Should be 'custom' or a number > 30",
                            })];
                    }
                    if (Number(days) < 30) {
                        return [2 /*return*/, res.status(409).json({
                                data: null,
                                message: "Days property is not valid. Should be 'custom' or a number > 30",
                            })];
                    }
                    endDate = (0, moment_1.default)(startDate).add(days, "days").toDate();
                }
                /* Validations */
                if (!markedDaysSanitized.includes(startDate.getDay())) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            message: "Start date does not match with marked days to read the bible",
                        })];
                }
                daysPerWeek = markedDaysSanitized.length;
                flagFirstDay = (function (startDate) {
                    if (startDate.getDay() == 0) {
                        return startDate;
                    }
                    else {
                        return (0, moment_1.default)(startDate)
                            .add(6 - startDate.getDay() + 1, "days")
                            .toDate();
                    }
                })(startDate);
                flagLastDay = (function (endDate) {
                    if (endDate.getDay() == 0) {
                        return endDate;
                    }
                    else {
                        return (0, moment_1.default)(endDate).subtract(endDate.getDay(), "days").toDate();
                    }
                })(endDate);
                numberOfWeeks = Math.round((Math.round(Math.abs((flagFirstDay - flagLastDay) / oneDay)) + 1) / 7);
                extraStartDays = (function (startDate, flagFirstDay, markedDaysSanitized) {
                    var nextDate = startDate;
                    var count = 0;
                    while (nextDate < flagFirstDay) {
                        if (markedDaysSanitized.includes(nextDate.getDay())) {
                            count++;
                        }
                        nextDate = (0, moment_1.default)(nextDate).add(1, "days").toDate();
                    }
                    return count;
                })(startDate, flagFirstDay, markedDaysSanitized);
                extraEndDays = (function (endDate, flagLastDay, markedDaysSanitized) {
                    var nextDate = endDate;
                    var count = 0;
                    while (nextDate >= flagLastDay) {
                        if (markedDaysSanitized.includes(nextDate.getDay())) {
                            count++;
                        }
                        nextDate = (0, moment_1.default)(nextDate).subtract(1, "days").toDate();
                    }
                    return count;
                })(endDate, flagLastDay, markedDaysSanitized);
                numberDays = numberOfWeeks * daysPerWeek + extraStartDays + extraEndDays;
                daysInString = (function (arrayDays) {
                    var days = "";
                    arrayDays.forEach(function (day) {
                        days = "".concat(days).concat(day);
                    });
                    return days;
                })(markedDaysSanitized);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(reading_plan_entity_1.IReadingPlans).count()];
            case 2:
                amountVerses = _b.sent();
                amountVersesPerDay = Math.round(Number(amountVerses) / numberDays);
                readingPlanCreated = (0, typeorm_1.getRepository)(reading_plan_entity_1.IReadingPlans).create({
                    name: name_1,
                    email: email,
                    start_date: startDate,
                    end_date: endDate,
                    days: daysInString,
                    amount_verses_per_day: amountVersesPerDay,
                    status: reading_plan_entity_1.enumStatus.PENDING,
                    amount_days_delivered: 0,
                    next_date: (0, getTodayDate_1.createStringFromDate)(startDate),
                });
                return [4 /*yield*/, (0, typeorm_1.getRepository)(reading_plan_entity_1.IReadingPlans).save(readingPlanCreated)];
            case 3:
                readingPlan = _b.sent();
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, email_1.sendCreationReadingPlan)(email, startDate, endDate, markedDaysSanitized)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/, res.status(200).json({
                    data: readingPlan,
                    message: "Book retrieved",
                })];
            case 8:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.readingPlansController = readingPlansController;
