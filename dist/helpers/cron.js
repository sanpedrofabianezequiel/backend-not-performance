"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.sendDailyVerses = exports.sendReadingPlanMessages = void 0;
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var date_1 = require("./date");
var moment_1 = __importDefault(require("moment"));
var email_1 = require("./email");
var sms_1 = require("./sms");
var typeorm_1 = require("typeorm");
var reading_plan_entity_1 = require("../entity/reading_plan.entity");
var verse_helper_1 = require("./verse.helper");
var subscription_entity_1 = require("../entity/subscription.entity");
var IResponseSubscription_1 = require("../interfaces/IResponseSubscription");
var generic_entity_1 = require("../entity/generic.entity");
var sendReadingPlanMessages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var todayDate, countReadingPlans, limit, pages, i, offset, readingPlans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                todayDate = (0, date_1.createStringFromDate)(Date.now());
                return [4 /*yield*/, (0, typeorm_1.getRepository)(reading_plan_entity_1.IReadingPlans).count({
                        next_date: todayDate
                    })];
            case 1:
                countReadingPlans = _a.sent();
                limit = 10;
                pages = (function (count, limit) {
                    var div = count / limit;
                    var pages = div.toFixed(0);
                    if (count % limit > 0 && count % limit < 5) {
                        pages = (div + 1).toFixed(0);
                    }
                    return pages;
                })(countReadingPlans, limit);
                i = 1;
                _a.label = 2;
            case 2:
                if (!(i <= Number(pages))) return [3 /*break*/, 6];
                offset = (i - 1) * limit;
                return [4 /*yield*/, (0, typeorm_1.getRepository)(reading_plan_entity_1.IReadingPlans).find({
                        where: {
                            next_date: todayDate
                        },
                        take: offset
                    })];
            case 3:
                readingPlans = _a.sent();
                console.log(readingPlans);
                readingPlans.forEach(function (plan) { return __awaiter(void 0, void 0, void 0, function () {
                    var nextDate, limitVerses, offsetVerses, data, verses, versesArray, progessPercentage, subject, listDayNames, dayNames;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                nextDate = (0, date_1.getNextDate)(todayDate, plan.days);
                                limitVerses = plan.amount_verses_per_day;
                                offsetVerses = Number(plan.amount_days_delivered) * Number(plan.amount_verses_per_day);
                                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n            SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n                   (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n                  (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n                FROM i_verses AS V\n                INNER JOIN i_books as B ON V.book_id = B.id\n                LEFT JOIN  i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n                LEFT JOIN  i_topics AS T ON VHT.topic_id = T.id\n                LIMIT ".concat(offsetVerses, ",").concat(limitVerses, "\n            "))];
                            case 1:
                                data = _a.sent();
                                console.log(data);
                                verses = data.map(function (resp) {
                                    return {
                                        id: resp.id,
                                        book_id: resp.book_id,
                                        chapter: resp.chapter,
                                        number: resp.number,
                                        slug: resp.slug,
                                        text: resp.text,
                                        url_image: resp.url_image,
                                        book: {
                                            id: resp.b_id,
                                            name: resp.b_name,
                                            number: resp.b_number,
                                            number_chapters: resp.b_number_chapters,
                                            slug: resp.b_slug,
                                            testament: resp.b_testament
                                        },
                                        topics: {
                                            id: resp.t_id,
                                            enabled: resp.t_enabled,
                                            name: resp.t_name,
                                            slug: resp.t_slug,
                                            url_image: resp.t_url_image
                                        }
                                    };
                                });
                                versesArray = (0, verse_helper_1.groupVersesByBookChapter)(verses);
                                progessPercentage = (((Number(plan.amount_days_delivered) * Number(plan.amount_verses_per_day)) / 32000) * 100).toFixed(2);
                                subject = "Your Bible Verse of the Days - ".concat(progessPercentage, "% Progress Bible Reading Plan");
                                listDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                dayNames = Array.from(plan.days).map(function (d) { return listDayNames[d]; });
                                (0, email_1.sendVersesPlanReading)(plan.email, subject, versesArray, {
                                    startDate: (0, moment_1.default)(plan.start_date).format('MMMM DD, YYYY'),
                                    endDate: (0, moment_1.default)(plan.end_date).format('MMMM DD, YYYY'),
                                    days: dayNames.join(',')
                                });
                                // Update record
                                plan.next_date = (0, date_1.createStringFromDate)(nextDate);
                                plan.amount_days_delivered++;
                                return [4 /*yield*/, (0, typeorm_1.getRepository)(reading_plan_entity_1.IReadingPlans).update({ id: plan.id }, __assign({}, plan))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, (0, sleep_promise_1.default)(2000)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.sendReadingPlanMessages = sendReadingPlanMessages;
var sendDailyVerses = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, subscriptions, i, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n    SELECT (V.text) AS text,(B.name) AS name,(V.chapter) AS chapter,(V.number) AS number\n        FROM i_dailys AS D\n            INNER JOIN i_verses AS V ON D.verse_id = V.id\n                INNER JOIN i_books AS B ON V.book_id = B.id\n                    WHERE D.date >= DATE(NOW())\n                        ORDER BY  D.date ASC\n                            LIMIT 1\n    ")];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).find({})];
            case 2:
                subscriptions = _b.sent();
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < subscriptions.length)) return [3 /*break*/, 13];
                _a = subscriptions[i].type;
                switch (_a) {
                    case IResponseSubscription_1.enumType.ONLY_SMS: return [3 /*break*/, 4];
                    case IResponseSubscription_1.enumType.ONLY_EMAIL: return [3 /*break*/, 6];
                    case IResponseSubscription_1.enumType.EMAIL_SMS: return [3 /*break*/, 8];
                }
                return [3 /*break*/, 11];
            case 4: return [4 /*yield*/, (0, sms_1.sendSMS)(subscriptions[i].phone, "".concat(response[0].text, " - BibleVerses"))];
            case 5:
                _b.sent();
                return [3 /*break*/, 12];
            case 6: return [4 /*yield*/, (0, email_1.sendDailyVerse)(subscriptions[i].email, "Bible Verse of the Day", response[0])];
            case 7:
                _b.sent();
                return [3 /*break*/, 12];
            case 8: return [4 /*yield*/, (0, email_1.sendDailyVerse)(subscriptions[i].email, "Bible Verse of the Day", response[0])];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, sms_1.sendSMS)(subscriptions[i].phone, "".concat(response[0].text, " - BibleVerses"))];
            case 10:
                _b.sent();
                return [3 /*break*/, 12];
            case 11: return [3 /*break*/, 12];
            case 12:
                i++;
                return [3 /*break*/, 3];
            case 13: return [4 /*yield*/, (0, sleep_promise_1.default)(2000)];
            case 14:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.sendDailyVerses = sendDailyVerses;
