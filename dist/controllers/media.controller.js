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
exports.getMediaItemsController = exports.mediaItemsIdentifierController = exports.postMediaItemsController = void 0;
var media_entity_1 = require("../entity/media.entity");
var generic_1 = require("../helpers/generic");
var typeorm_1 = require("typeorm");
var uploadAWS_helper_1 = require("../helpers/uploadAWS.helper");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var postMediaItemsController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newFile, allowedFileType, urlFileProvider, item, newMedia, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({
                            data: null,
                            message: "Bad request, Image is required",
                        })];
                }
                newFile = req.file;
                allowedFileType = ["image/png", "image/jpg", "image/jpeg"];
                if (!allowedFileType.includes(newFile.mimetype)) {
                    return [2 /*return*/, res.status(400).json({
                            data: null,
                            message: "Bad request",
                        })];
                }
                return [4 /*yield*/, (0, uploadAWS_helper_1.uploadFile)(newFile, "media/".concat(newFile.originalname), newFile.mimetype, false)];
            case 1:
                urlFileProvider = _a.sent();
                if (urlFileProvider == "") {
                    return [2 /*return*/, res.status(500).json({
                            data: {},
                            message: "Error uploading file to the provider",
                        })];
                }
                item = (0, typeorm_1.getRepository)(media_entity_1.IMediaItems).create({
                    name: newFile.originalname,
                    description: req.body.description || "",
                    type: newFile.mimetype,
                    height: -1,
                    width: -1,
                    size: newFile.size,
                    url: urlFileProvider,
                });
                return [4 /*yield*/, (0, typeorm_1.getRepository)(media_entity_1.IMediaItems).save(item)];
            case 2:
                newMedia = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: __assign({}, newMedia),
                        message: "File is added",
                    })];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.postMediaItemsController = postMediaItemsController;
var mediaItemsIdentifierController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, subDomainSpaceEndpint, item, urlBase_1, key, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                identifier = req.params.identifier;
                subDomainSpaceEndpint = "bibleverses";
                return [4 /*yield*/, (0, typeorm_1.getRepository)(media_entity_1.IMediaItems).findOne({
                        where: {
                            id: identifier
                        }
                    })];
            case 1:
                item = _a.sent();
                if (!item) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "File does not exists",
                        })];
                }
                urlBase_1 = "https://".concat(subDomainSpaceEndpint, ".").concat(process.env.DO_SPACE_ENDPOINT);
                if (!item.url.includes(urlBase_1)) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            message: "File domain/pattern is not allowed",
                        })];
                }
                key = (function (url) {
                    var splitStr = url.split("".concat(urlBase_1, "/"));
                    url = splitStr[1];
                    url = url.replace(/%20/g, " ");
                    return url;
                })(item.url);
                return [4 /*yield*/, (0, uploadAWS_helper_1.deleteFile)(key)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(media_entity_1.IMediaItems).delete({
                        id: item.id
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: {},
                        message: "File is deleted",
                    })];
            case 4:
                error_2 = _a.sent();
                res.status(500).json({
                    data: {},
                    message: "Internal error",
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.mediaItemsIdentifierController = mediaItemsIdentifierController;
var getMediaItemsController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schemaQuery, _a, items, totalItems, data, _i, items_1, x, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                schemaQuery = {
                    page: Number(req.query.page) - 1 || 0,
                    limit: Number(req.query.limit) || 10
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(media_entity_1.IMediaItems).findAndCount({
                        skip: schemaQuery.page,
                        take: schemaQuery.limit
                    })];
            case 2:
                _a = _b.sent(), items = _a[0], totalItems = _a[1];
                data = [];
                for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                    x = items_1[_i];
                    data.push({
                        id: x.id,
                        name: x.name,
                        description: x.description,
                        type: x.type,
                        height: x.height,
                        width: x.width,
                        size: x.size,
                        url: x.url,
                        created_at: x.created_at
                    });
                }
                return [2 /*return*/, res.status(200).json({
                        data: data || [],
                        pagination: {
                            total: totalItems,
                            pages: Math.floor((0, generic_1.calcNumberOfPages)(schemaQuery.limit, totalItems)),
                            results: items.length,
                            page: schemaQuery.page + 1,
                            limit: schemaQuery.limit == -1 ? items.length : schemaQuery.limit
                        },
                        message: "Media items retrieved",
                    })];
            case 3:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMediaItemsController = getMediaItemsController;
