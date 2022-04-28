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
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicBySearchController = exports.putTopicByIdAndImageController = exports.putTopicByIdController = exports.deleteTopicByIdController = exports.getTopicIdentifierController = exports.getTopicController = exports.postTopicController = void 0;
var typeorm_1 = require("typeorm");
var Topic_entity_1 = require("../entity/Topic.entity");
var generic_1 = require("../helpers/generic");
var uploadAWS_helper_1 = require("../helpers/uploadAWS.helper");
/*interface PropsFiles {
    fielname?: string,
    name?: string ,
    encoding?: string,
    mimetype?: string,
    destination?: string,
    filename?: string,
    path?: string,
    size?: number
} */
var postTopicController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, enabled, topicByName, topic, newTopic, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, description = _a.description, enabled = _a.enabled;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: {
                            name: name
                        }
                    })];
            case 2:
                topicByName = _b.sent();
                if (topicByName) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            messagE: "Already exists a topic with the same name"
                        })];
                }
                topic = (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).create({
                    url_image: '',
                    name: name,
                    slug: (0, generic_1.generateSlug)(name),
                    description: description,
                    enabled: enabled
                });
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).save(topic)];
            case 3:
                newTopic = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: __assign({}, newTopic), message: "Topic retrieved" })];
            case 4:
                error_1 = _b.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.postTopicController = postTopicController;
var getTopicController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schemaQuery, _a, topics, totalTopics, data, error_2;
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
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findAndCount({
                        skip: schemaQuery.page,
                        take: schemaQuery.limit
                    })];
            case 2:
                _a = _b.sent(), topics = _a[0], totalTopics = _a[1];
                data = topics.map(function (x) {
                    return {
                        id: x.id,
                        name: x.name,
                        slug: x.slug,
                        enabled: x.enabled,
                        url_image: x.url_image,
                    };
                });
                return [2 /*return*/, res.status(200).json({
                        data: data || [],
                        pagination: {
                            total: totalTopics,
                            pages: Math.floor((0, generic_1.calcNumberOfPages)(schemaQuery.limit, totalTopics)),
                            results: topics.length,
                            page: schemaQuery.page,
                            limit: schemaQuery.limit,
                        },
                        message: "Topics retrieved",
                    })];
            case 3:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTopicController = getTopicController;
var getTopicIdentifierController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, topic, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identifier = req.params.identifier;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: [
                            { id: identifier },
                            { slug: identifier }
                        ]
                    })];
            case 2:
                topic = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: {
                            id: topic === null || topic === void 0 ? void 0 : topic.id,
                            name: topic === null || topic === void 0 ? void 0 : topic.name,
                            slug: topic === null || topic === void 0 ? void 0 : topic.slug,
                            enabled: topic === null || topic === void 0 ? void 0 : topic.enabled,
                            url_image: topic === null || topic === void 0 ? void 0 : topic.url_image,
                        },
                        message: "Topic retrieved",
                    })];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTopicIdentifierController = getTopicIdentifierController;
var deleteTopicByIdController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existsTopic, topic, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                existsTopic = _a.sent();
                if (!existsTopic) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Not found",
                        })];
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).delete({ id: parseInt(id) })];
            case 3:
                topic = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: topic,
                        message: "Topic deleted",
                    })];
            case 4:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteTopicByIdController = deleteTopicByIdController;
var putTopicByIdController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, enabled, existsTopic, topicByName, updatedTopic, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, enabled = _a.enabled;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                existsTopic = _b.sent();
                if (!existsTopic) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: 'Not found'
                        })];
                }
                if (!(name != existsTopic.name)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: {
                            name: name
                        }
                    })];
            case 3:
                topicByName = _b.sent();
                if (topicByName) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            message: "Already exists a topic with the same name",
                        })];
                }
                _b.label = 4;
            case 4: return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).update({ id: parseInt(id) }, __assign(__assign({}, req.body), { slug: (0, generic_1.generateSlug)(name), id: existsTopic.id }))];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 6:
                updatedTopic = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        data: updatedTopic,
                        message: "Topic updated",
                    })];
            case 7:
                error_5 = _b.sent();
                console.log(error_5);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.putTopicByIdController = putTopicByIdController;
var putTopicByIdAndImageController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existsTopic, newFile, allowedFileType, urlFileProvider, updatedTopic, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                existsTopic = _a.sent();
                console.log(existsTopic);
                if (!existsTopic) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: 'Not found'
                        })];
                }
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({
                            data: null,
                            message: "bad request"
                        })];
                }
                ;
                newFile = req.file;
                allowedFileType = ["image/png", "image/jpg", "image/jpeg"];
                if (!allowedFileType.includes(newFile.mimetype)) {
                    return [2 /*return*/, res.status(400).json({
                            data: null,
                            message: "Bad request",
                        })];
                }
                console.log(newFile);
                return [4 /*yield*/, (0, uploadAWS_helper_1.uploadFile)(newFile, "topics/".concat(newFile.originalname), newFile.mimetype, false)];
            case 3:
                urlFileProvider = _a.sent();
                if (urlFileProvider == '') {
                    return [2 /*return*/, res.status(500).json({
                            data: {},
                            message: "Error uploading file to the provider",
                        })];
                }
                updatedTopic = existsTopic;
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).update({ id: parseInt(req.params.id) }, __assign(__assign({}, existsTopic), { url_image: urlFileProvider }))];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: __assign(__assign({}, updatedTopic), { url_image: urlFileProvider }),
                        message: "Image added to the topic",
                    })];
            case 5:
                error_6 = _a.sent();
                console.log(error_6);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.putTopicByIdAndImageController = putTopicByIdAndImageController;
var topicBySearchController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var text, schemaQuery, totalTopics, topics, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = req.body.text;
                schemaQuery = {
                    page: Number(req.query.page) - 1 || 0,
                    limit: Number(req.query.limit) || 10
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).count({
                        where: [
                            { name: (0, typeorm_1.Like)("%".concat(text, "%")) }
                        ]
                    })];
            case 2:
                totalTopics = _a.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).find({
                        name: (0, typeorm_1.Like)("%".concat(text, "%"))
                    })];
            case 3:
                topics = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: topics || [],
                        pagination: {
                            total: totalTopics,
                            pages: Math.floor((0, generic_1.calcNumberOfPages)(schemaQuery.limit, totalTopics)),
                            results: topics.length,
                            page: schemaQuery.page,
                            limit: schemaQuery.limit,
                        },
                        message: "Topics retrieved",
                    })];
            case 4:
                error_7 = _a.sent();
                console.log(error_7);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: 'Internal error'
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.topicBySearchController = topicBySearchController;
