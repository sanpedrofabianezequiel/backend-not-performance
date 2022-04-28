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
exports.deleteVersesTopicIdentifierController = exports.postVersesTopicIdentifierController = exports.getVersesTopicIdentifierController = void 0;
var generic_1 = require("../helpers/generic");
var verse_topic_entity_1 = require("../entity/verse_topic.entity");
var typeorm_1 = require("typeorm");
var Topic_entity_1 = require("../entity/Topic.entity");
var generic_entity_1 = require("../entity/generic.entity");
var getVersesTopicIdentifierController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topicIdentifier, schemaQuery, topic, totalVerses, response, data, dataFinal, _i, response_1, x, i, addTopics, where, tops, x, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                topicIdentifier = req.params.topicIdentifier;
                schemaQuery = {
                    page: Number(req.query.page) - 1 || 1,
                    limit: Number(req.query.limit) || 10
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Topic_entity_1.ITopics).findOne({
                        where: [
                            { id: topicIdentifier },
                            { slug: topicIdentifier.toLocaleLowerCase() }
                        ]
                    })];
            case 2:
                topic = _a.sent();
                if (!topic) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Not found",
                        })];
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(verse_topic_entity_1.IVersesHaveTopics).count({
                        where: {
                            topic_id: topic.id
                        }
                    })];
            case 3:
                totalVerses = _a.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT  V.id id, book_id ,chapter, V.number number,V.slug slug,text,V.url_image url_image,\n                B.id b_id,B.number b_number, B.name  b_name, B.testament  b_testament, B.slug b_slug,B.number_chapters b_number_chapters,\n                VTH.topic_id\n            FROM i_verses AS V\n                INNER JOIN i_verses_have_topics AS VTH ON  VTH.verse_id = V.id\n                    INNER JOIN i_books AS B ON B.id = V.book_id\n                    WHERE VTH.topic_id = ".concat(topic.id, "\n                         LIMIT ").concat(schemaQuery.page, ",").concat(schemaQuery.limit, "               \n        "))];
            case 4:
                response = _a.sent();
                if (!response) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Not found",
                        })];
                }
                data = [];
                dataFinal = [];
                for (_i = 0, response_1 = response; _i < response_1.length; _i++) {
                    x = response_1[_i];
                    data.push({
                        id: x.id,
                        book_id: x.book_id,
                        chapter: x.chapter,
                        number: x.number,
                        slug: x.slug,
                        text: x.text,
                        url_image: x.url_image,
                        book: {
                            id: x.b_id,
                            name: x.b_name,
                            number: x.b_number,
                            number_chapters: x.b_number_chapters,
                            slug: x.b_slug,
                            testament: x.b_testament,
                        },
                        topic_id: x.topic_id,
                    });
                }
                i = 0;
                _a.label = 5;
            case 5:
                if (!(i < data.length)) return [3 /*break*/, 10];
                addTopics = [];
                where = '';
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n            SELECT * FROM i_verses_have_topics WHERE verse_id = ".concat(data[i].id))];
            case 6:
                tops = _a.sent();
                if (!(tops.length > 0)) return [3 /*break*/, 8];
                for (x = 0; x < tops.length; x++) {
                    where += "   ".concat(tops[x].topic_id, " ").concat((tops[x + 1] != undefined) ? ' , ' : ' ', "  ");
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n                SELECT * FROM i_topics AS T\n                     WHERE   T.id  IN ( ".concat(where, " ) "))];
            case 7:
                addTopics = (_a.sent());
                _a.label = 8;
            case 8:
                data[i] = __assign(__assign({}, data[i]), { topics: addTopics });
                _a.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 5];
            case 10: return [2 /*return*/, res.status(200).json({
                    data: data,
                    message: "Retrieved",
                    pagination: {
                        total: totalVerses,
                        pages: Math.floor((0, generic_1.calcNumberOfPages)(schemaQuery.limit, totalVerses)),
                        results: data.length,
                        page: schemaQuery.page,
                        limit: schemaQuery.limit
                    },
                })];
            case 11:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.getVersesTopicIdentifierController = getVersesTopicIdentifierController;
var postVersesTopicIdentifierController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topic_id, idVerse, verseTopic, newVerse, newVerseTopic, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                topic_id = req.body.topic_id;
                idVerse = req.params.idVerse;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(verse_topic_entity_1.IVersesHaveTopics).findOne({
                        where: {
                            topic_id: topic_id,
                            verse_id: idVerse
                        }
                    })];
            case 2:
                verseTopic = _a.sent();
                if (verseTopic) {
                    return [2 /*return*/, res.status(200).json({
                            data: null,
                            message: "Already exists",
                        })];
                }
                newVerse = (0, typeorm_1.getRepository)(verse_topic_entity_1.IVersesHaveTopics).create({
                    topic_id: topic_id,
                    verse_id: idVerse,
                });
                return [4 /*yield*/, (0, typeorm_1.getRepository)(verse_topic_entity_1.IVersesHaveTopics).save(newVerse)];
            case 3:
                newVerseTopic = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: newVerseTopic,
                        message: "Data retrieved",
                    })];
            case 4:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.postVersesTopicIdentifierController = postVersesTopicIdentifierController;
var deleteVersesTopicIdentifierController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, idVerse, idTopic, verseTopic, deleteResult, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, idVerse = _a.idVerse, idTopic = _a.idTopic;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(verse_topic_entity_1.IVersesHaveTopics).findOne({
                        where: {
                            verse_id: idVerse,
                            topic_id: idTopic
                        }
                    })];
            case 2:
                verseTopic = _b.sent();
                if (!verseTopic) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Not found",
                        })];
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(verse_topic_entity_1.IVersesHaveTopics).delete({
                        verse_id: idVerse,
                        topic_id: idTopic,
                    })];
            case 3:
                deleteResult = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        data: deleteResult,
                        message: "Removed",
                    })];
            case 4:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: "Internal error",
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteVersesTopicIdentifierController = deleteVersesTopicIdentifierController;
