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
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscriptionController = exports.subscriptionAllController = exports.subscriptionByIdAndTypeController = exports.subscriptionController = void 0;
var typeorm_1 = require("typeorm");
var email_1 = require("../helpers/email");
var subscription_entity_1 = require("../entity/subscription.entity");
var generic_entity_1 = require("../entity/generic.entity");
var IResponseSubscription_1 = require("../interfaces/IResponseSubscription");
var sms_1 = require("../helpers/sms");
var subscriptionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, email, phone, emailValid, phoneValid, options, existEmailSubscription, existPhoneSubscription, newSubscription, subscription, response, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, type = _a.type, email = _a.email, phone = _a.phone;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                emailValid = true;
                phoneValid = true;
                options = [IResponseSubscription_1.enumType.EMAIL_SMS, IResponseSubscription_1.enumType.ONLY_EMAIL, IResponseSubscription_1.enumType.ONLY_SMS];
                if (!options.includes(type.toLowerCase())) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Invalid format type",
                        })];
                }
                switch (type.toLowerCase()) {
                    case IResponseSubscription_1.enumType.ONLY_SMS:
                        phoneValid = !phone ? false : true;
                        break;
                    case IResponseSubscription_1.enumType.ONLY_EMAIL:
                        emailValid = !email ? false : true;
                        break;
                    case IResponseSubscription_1.enumType.EMAIL_SMS:
                        phoneValid = !phone ? false : true;
                        emailValid = !email ? false : true;
                        break;
                    default:
                        // only-email
                        emailValid = !email ? false : true;
                        break;
                }
                if (!phoneValid || !emailValid) {
                    return [2 /*return*/, res.status(400).json({
                            data: null,
                            message: "Email or phone is expected.",
                        })];
                }
                if (!email) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).findOne({
                        where: {
                            email: email,
                        },
                    })];
            case 2:
                existEmailSubscription = _b.sent();
                if (existEmailSubscription) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            message: "This email is already registered.",
                        })];
                }
                _b.label = 3;
            case 3:
                if (!phone) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).findOne({
                        where: {
                            phone: phone,
                        },
                    })];
            case 4:
                existPhoneSubscription = _b.sent();
                if (existPhoneSubscription) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            message: "This phone is already registered.",
                        })];
                }
                _b.label = 5;
            case 5:
                newSubscription = (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).create({
                    email: email || "",
                    phone: phone || "",
                    type: type || IResponseSubscription_1.enumType.ONLY_EMAIL
                });
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).save(newSubscription)];
            case 6:
                subscription = _b.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n    SELECT (V.text) AS text,(B.name) AS name,(V.chapter) AS chapter,(V.number) AS number\n        FROM i_dailys AS D\n            INNER JOIN i_verses AS V ON D.verse_id = V.id\n                INNER JOIN i_books AS B ON V.book_id = B.id\n                    WHERE D.date >= DATE(NOW())\n                        ORDER BY  D.date ASC\n                            LIMIT 1\n    ")];
            case 7:
                response = _b.sent();
                return [4 /*yield*/, (0, email_1.sendWelcomeSubscription)(email, response[0])];
            case 8:
                _b.sent();
                if (!(type == IResponseSubscription_1.enumType.ONLY_SMS || type == IResponseSubscription_1.enumType.EMAIL_SMS)) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, sms_1.sendSMS)(phone, response[0].text)];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [2 /*return*/, res.status(200).json({
                    data: subscription,
                    message: "Subscription done successfully",
                })];
            case 11:
                error_1 = _b.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.subscriptionController = subscriptionController;
var subscriptionByIdAndTypeController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, type, existIdSubscription, message, phone, email, newType, subscription, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, id = _a.id, type = _a.type;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                existIdSubscription = _b.sent();
                if (!existIdSubscription) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Subscription does not exists",
                        })];
                }
                message = "";
                if (!(existIdSubscription.type == IResponseSubscription_1.enumType.EMAIL_SMS && type != IResponseSubscription_1.enumType.EMAIL_SMS)) return [3 /*break*/, 4];
                phone = type == IResponseSubscription_1.enumType.ONLY_SMS ? "" : existIdSubscription.phone;
                email = type == IResponseSubscription_1.enumType.ONLY_EMAIL ? "" : existIdSubscription.email;
                newType = type == IResponseSubscription_1.enumType.ONLY_SMS ? IResponseSubscription_1.enumType.ONLY_EMAIL : IResponseSubscription_1.enumType.ONLY_SMS;
                message = "Subscription modified successfully";
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).update({ id: parseInt(id) }, {
                        type: newType,
                        phone: phone,
                        email: email
                    })];
            case 3:
                _b.sent();
                return [3 /*break*/, 7];
            case 4:
                if (!(existIdSubscription.type != IResponseSubscription_1.enumType.EMAIL_SMS && type != IResponseSubscription_1.enumType.EMAIL_SMS && type != existIdSubscription.type)) return [3 /*break*/, 5];
                message = "Subscription has not been modified";
                return [3 /*break*/, 7];
            case 5:
                message = "Subscription removed successfully";
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).delete({ id: parseInt(id) })];
            case 6:
                subscription = _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/, res.status(200).json({
                    data: null,
                    message: message,
                })];
            case 8:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.subscriptionByIdAndTypeController = subscriptionByIdAndTypeController;
var unsubscriptionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, unsubscriptions, subscription, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.params.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).find({ email: email })];
            case 2:
                unsubscriptions = _a.sent();
                console.log(unsubscriptions);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).delete({ id: parseInt(unsubscriptions[0].id) })];
            case 3:
                subscription = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: null,
                        message: "Subscription removed successfully",
                    })];
            case 4:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.unsubscriptionController = unsubscriptionController;
var subscriptionAllController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subscriptions, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(subscription_entity_1.ISubscriptions).find()];
            case 1:
                subscriptions = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: subscriptions,
                        message: "Subscriptions list",
                    })];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.subscriptionAllController = subscriptionAllController;
