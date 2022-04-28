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
exports.getVerseWithImagesController = exports.verseIdentifierImagesController = exports.nextVerseController = exports.postVerseSearchController = exports.getVerseRandomController = exports.putVerseByIdController = exports.deleteVerseByIdController = exports.getBooksChaptersController = exports.getVersesIdentifierController = exports.getVersesController = exports.getVersesRouterInfoController = exports.postVersesController = void 0;
var gettters_1 = require("../helpers/gettters");
var generic_1 = require("../helpers/generic");
var typeorm_1 = require("typeorm");
var Book_entity_1 = require("../entity/Book.entity");
var Verse_entity_1 = require("../entity/Verse.entity");
var verse_helper_1 = require("../helpers/verse.helper");
var uploadAWS_helper_1 = require("../helpers/uploadAWS.helper");
var generic_entity_1 = require("../entity/generic.entity");
var base64_1 = require("../helpers/base64");
var getVerseWithImagesController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, verses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug\n            FROM i_verses as V\n                WHERE V.url_image <> ''\n        ")];
            case 1:
                data = _a.sent();
                verses = data.map(function (resp) {
                    return {
                        id: resp.id,
                        book_id: resp.book_id,
                        chapter: resp.chapter,
                        number: resp.number,
                        slug: resp.slug,
                        text: resp.text,
                        url_image: resp.url_image,
                    };
                });
                return [2 /*return*/, res.status(200).json({
                        data: verses || [],
                        message: "Verses with images retrieved"
                    })];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: 'Internal error'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getVerseWithImagesController = getVerseWithImagesController;
var postVersesController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, book_id, chapter, number, text, url_image, slugToFind, verse, existsBook, vers, newBook, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, book_id = _a.book_id, chapter = _a.chapter, number = _a.number, text = _a.text, url_image = _a.url_image;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                slugToFind = "".concat(book_id, "-").concat(chapter, "-").concat(number);
                return [4 /*yield*/, (0, gettters_1.getByIdentifier)(slugToFind)];
            case 2:
                verse = _b.sent();
                if (verse) {
                    console.log(verse);
                    return [2 /*return*/, res.status(409).json({ data: null, message: "Already exists the versed" })];
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: {
                            id: book_id
                        }
                    })];
            case 3:
                existsBook = _b.sent();
                if (!existsBook) {
                    return [2 /*return*/, res.status(409).json({ data: null, message: "Conflict the book does not exist", })];
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).create({
                        id: parseInt((0, gettters_1.generateVerseId)(book_id, chapter, number)),
                        book_id: book_id,
                        chapter: chapter,
                        number: number,
                        text: text,
                        slug: slugToFind,
                        url_image: url_image || ''
                    })];
            case 4:
                vers = _b.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).save(vers)];
            case 5:
                newBook = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        data: newBook,
                        message: "Verses retrieved"
                    })];
            case 6:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        ok: true,
                        data: null,
                        message: 'Internal error'
                    })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.postVersesController = postVersesController;
var getVersesRouterInfoController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schemRequest, data, verses, _i, data_1, resp, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schemRequest = {
                    page: Number(req.query.page) - 1 || 0,
                    limit: Number(req.query.limit) || 10
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n            FROM i_verses AS V\n            INNER JOIN i_books as B ON V.book_id = B.id\n            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n            INNER JOIN i_topics AS T ON VHT.topic_id = T.id\n            LIMIT ".concat(schemRequest.page, ",").concat(schemRequest.limit, "\n        "))];
            case 2:
                data = _a.sent();
                verses = [];
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    resp = data_1[_i];
                    verses.push({
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
                            url_image: resp.t_url_image,
                        }
                    });
                }
                return [2 /*return*/, res.status(200).json({
                        data: verses || [],
                        pagination: {
                            total: data.length,
                            pages: Math.floor((0, generic_1.calcNumberOfPages)(schemRequest.limit, data.length)),
                            results: data.length,
                            page: schemRequest.page,
                            limit: schemRequest.limit,
                        },
                        message: "Verses retrieved",
                    })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: 'Internal error'
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getVersesRouterInfoController = getVersesRouterInfoController;
var getVersesController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schemRequest, data, verses, _i, data_2, resp, verseImage, bookImage, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schemRequest = {
                    page: Number(req.query.page) - 1 || 0,
                    limit: Number(req.query.limit) || 30
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n            FROM i_verses AS V\n            INNER JOIN i_books as B ON V.book_id = B.id\n            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n            INNER JOIN i_topics AS T ON VHT.topic_id = T.id\n            LIMIT ".concat(schemRequest.page, ",").concat(schemRequest.limit, "\n        "))];
            case 2:
                data = _a.sent();
                verses = [];
                _i = 0, data_2 = data;
                _a.label = 3;
            case 3:
                if (!(_i < data_2.length)) return [3 /*break*/, 9];
                resp = data_2[_i];
                verseImage = void 0;
                bookImage = void 0;
                if (!(resp.url_image !== '')) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, base64_1.convertToBase64)(resp.url_image)];
            case 4:
                verseImage = _a.sent();
                _a.label = 5;
            case 5:
                if (!(resp.t_url_image !== '')) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, base64_1.convertToBase64)(resp.t_url_image)];
            case 6:
                bookImage = _a.sent();
                _a.label = 7;
            case 7:
                verses.push({
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
                        url_image: resp.t_url_image,
                    }
                });
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9: return [2 /*return*/, res.status(200).json({
                    data: verses || [],
                    pagination: {
                        total: data.length,
                        pages: Math.floor((0, generic_1.calcNumberOfPages)(schemRequest.limit, data.length)),
                        results: verses.length,
                        page: schemRequest.page,
                        limit: schemRequest.limit,
                    },
                    message: "Verses retrieved",
                })];
            case 10:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: 'Internal error'
                    })];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.getVersesController = getVersesController;
var getVersesIdentifierController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, verse, addTopics, where, tops, x, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identifier = req.params.identifier;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, gettters_1.getByIdentifier)(identifier)];
            case 2:
                verse = _a.sent();
                if (!verse)
                    return [2 /*return*/, res.status(404).json({ data: null, message: 'Not found' })];
                addTopics = [];
                where = '';
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT * FROM i_verses_have_topics WHERE verse_id = ".concat(verse[0].id))];
            case 3:
                tops = _a.sent();
                if (!(tops.length > 0)) return [3 /*break*/, 5];
                for (x = 0; x < tops.length; x++) {
                    where += "   ".concat(tops[x].topic_id, " ").concat((tops[x + 1] != undefined) ? ' , ' : ' ', "  ");
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n            SELECT * FROM i_topics AS T\n                 WHERE   T.id  IN ( ".concat(where, " ) "))];
            case 4:
                addTopics = (_a.sent());
                _a.label = 5;
            case 5:
                verse[0] = __assign(__assign({}, verse[0]), { topics: addTopics });
                return [2 /*return*/, res.status(200).json({
                        data: verse[0],
                        message: "Verse retrieved"
                    })];
            case 6:
                error_5 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        ok: true,
                        data: null,
                        message: 'Internal error'
                    })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getVersesIdentifierController = getVersesIdentifierController;
var getBooksChaptersController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, verses, data, i, addTopics, where, tops, x, hash_1, arraySet, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identifier = req.params.identifier;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4 /*yield*/, (0, gettters_1.getByChapterSlug)(identifier)];
            case 2:
                verses = _a.sent();
                data = verses;
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < data.length)) return [3 /*break*/, 8];
                addTopics = [];
                where = '';
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n            SELECT * FROM i_verses_have_topics WHERE verse_id = ".concat(data[i].id))];
            case 4:
                tops = _a.sent();
                if (!(tops.length > 0)) return [3 /*break*/, 6];
                for (x = 0; x < tops.length; x++) {
                    where += "   ".concat(tops[x].topic_id, " ").concat((tops[x + 1] != undefined) ? ' , ' : ' ', "  ");
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n                SELECT * FROM i_topics AS T\n                     WHERE   T.id  IN ( ".concat(where, " ) "))];
            case 5:
                addTopics = (_a.sent());
                _a.label = 6;
            case 6:
                data[i] = __assign(__assign({}, data[i]), { topics: addTopics });
                _a.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 3];
            case 8:
                hash_1 = {};
                arraySet = data.filter(function (x) { return hash_1[x.id] ? false : (hash_1[x.id] = true); });
                return [2 /*return*/, res.status(200).json({
                        data: arraySet,
                        message: "Verse retrieved",
                    })];
            case 9:
                error_6 = _a.sent();
                console.log(error_6);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        message: 'Internal error'
                    })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.getBooksChaptersController = getBooksChaptersController;
var deleteVerseByIdController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existsVerse, verse, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getTreeRepository)(Verse_entity_1.IVerses).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                existsVerse = _a.sent();
                if (!existsVerse) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Not found",
                        })];
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).delete({ id: parseInt(id) })];
            case 3:
                verse = _a.sent();
                return [2 /*return*/, res.status(401).json({
                        data: verse,
                        message: "Verse deleted",
                    })];
            case 4:
                error_7 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        ok: true,
                        data: null,
                        message: 'Internal error'
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteVerseByIdController = deleteVerseByIdController;
var putVerseByIdController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, book_id, chapter, number, text, resp, data, existsVerse, existsBook, idtoBeUpdated, existsVerseToUpdate, verseImage, bookImage, _i, resp_1, response, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, book_id = _a.book_id, chapter = _a.chapter, number = _a.number, text = _a.text;
                resp = [];
                data = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 15, , 16]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).findOne({
                        where: {
                            id: parseInt(id)
                        }
                    })];
            case 2:
                existsVerse = _b.sent();
                if (!existsVerse) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Not found",
                        })];
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).findOne({
                        where: {
                            id: parseInt(id)
                        }
                    })];
            case 3:
                existsBook = _b.sent();
                if (!existsBook) {
                    return [2 /*return*/, res.status(409).json({
                            data: null,
                            message: "Conflict the book does not exist",
                        })];
                }
                idtoBeUpdated = (0, gettters_1.generateVerseId)(book_id, chapter, number);
                if (!(id != idtoBeUpdated)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).findOne({
                        where: {
                            id: parseInt(idtoBeUpdated)
                        }
                    })];
            case 4:
                existsVerseToUpdate = _b.sent();
                if (existsVerseToUpdate)
                    return [2 /*return*/, res.status(409).json({ data: null, message: "Conflict already exists a verse with the same bookId, chapter and number", })];
                _b.label = 5;
            case 5: return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).update({ id: parseInt(id) }, {
                    id: parseInt((0, gettters_1.generateVerseId)(book_id, chapter, number)),
                    book_id: book_id,
                    chapter: chapter,
                    number: number
                })];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT  V.id id, book_id ,chapter, V.number number,V.slug slug,text,V.url_image url_image,\n            B.id b_id,B.number b_number, B.name  b_name, B.testament  b_testament, B.slug b_slug,B.number_chapters b_number_chapters,\n            T.id t_id,T.name t_name, T.slug  t_slug, T.enabled  t_enabled, T.url_image t_url_image\n        FROM i_verses AS V\n            INNER JOIN i_books AS B ON V.book_id = B.id\n                INNER JOIN i_verses_have_topics AS VTH ON V.id = VTH.verse_id\n                    INNER JOIN i_topics AS T ON VTH.topic_id = T.id\n                            WHERE V.id = ".concat(idtoBeUpdated, "\n                                LIMIT 1\n        "))];
            case 7:
                resp = (_b.sent());
                verseImage = void 0;
                bookImage = void 0;
                _i = 0, resp_1 = resp;
                _b.label = 8;
            case 8:
                if (!(_i < resp_1.length)) return [3 /*break*/, 14];
                response = resp_1[_i];
                if (!(response.url_image !== '')) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, base64_1.convertToBase64)(response.url_image)];
            case 9:
                verseImage = _b.sent();
                _b.label = 10;
            case 10:
                if (!(response.t_url_image !== '')) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, base64_1.convertToBase64)(response.t_url_image)];
            case 11:
                bookImage = _b.sent();
                _b.label = 12;
            case 12:
                data.push({
                    id: response.id,
                    book_id: response.book_id,
                    chapter: response.chapter,
                    number: response.number,
                    slug: response.slug,
                    text: response.text,
                    url_image: response.url_image,
                    book: {
                        id: response.b_id,
                        name: response.b_name,
                        number: response.b_number,
                        number_chapters: response.b_number_chapters,
                        slug: response.b_slug,
                        testament: response.b_testament,
                    },
                    topics: {
                        id: response.t_id,
                        enabled: response.t_enabled,
                        name: response.t_name,
                        slug: response.t_slug,
                        url_image: response.t_url_image
                    }
                });
                _b.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 8];
            case 14: return [2 /*return*/, res.status(401).json({
                    data: data,
                    message: "Verse updated",
                })];
            case 15:
                error_8 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        ok: true,
                        data: null,
                        message: 'Internal error'
                    })];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.putVerseByIdController = putVerseByIdController;
var getVerseRandomController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, response, verseImage, bookImage, _i, response_1, resp, responseRelated, dataRelated, _a, responseRelated_1, respQuery, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n            FROM i_verses AS V\n            INNER JOIN i_books as B ON V.book_id = B.id\n            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n            INNER JOIN i_topics AS T ON VHT.topic_id = T.id\n            ORDER BY RAND()\n            LIMIT 1\n        ")];
            case 2:
                response = _b.sent();
                if (!response) {
                    return [2 /*return*/, res.status(404).json({
                            data: null,
                            message: "Not found",
                        })];
                }
                verseImage = void 0;
                bookImage = void 0;
                _i = 0, response_1 = response;
                _b.label = 3;
            case 3:
                if (!(_i < response_1.length)) return [3 /*break*/, 9];
                resp = response_1[_i];
                if (!(resp.url_image !== '')) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, base64_1.convertToBase64)(resp.url_image)];
            case 4:
                verseImage = _b.sent();
                _b.label = 5;
            case 5:
                if (!(resp.t_url_image !== '')) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, base64_1.convertToBase64)(resp.t_url_image)];
            case 6:
                bookImage = _b.sent();
                _b.label = 7;
            case 7:
                data.push({
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
                        url_image: resp.t_url_image,
                    }
                });
                _b.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9: return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n            FROM i_verses AS V\n            INNER JOIN i_books as B ON V.book_id = B.id\n            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n            INNER JOIN i_topics AS T ON VHT.topic_id = T.id\n            WHERE V.chapter = ".concat(data[0].chapter, " and V.book_id =  ").concat(data[0].book_id, " and V.number != ").concat(data[0].number, "\n        "))];
            case 10:
                responseRelated = _b.sent();
                dataRelated = [];
                for (_a = 0, responseRelated_1 = responseRelated; _a < responseRelated_1.length; _a++) {
                    respQuery = responseRelated_1[_a];
                    dataRelated.push({
                        id: respQuery.id,
                        book_id: respQuery.book_id,
                        chapter: respQuery.chapter,
                        number: respQuery.number,
                        slug: respQuery.slug,
                        text: respQuery.text,
                        url_image: respQuery.url_image,
                        book: {
                            id: respQuery.b_id,
                            name: respQuery.b_name,
                            number: respQuery.b_number,
                            number_chapters: respQuery.b_number_chapters,
                            slug: respQuery.b_slug,
                            testament: respQuery.b_testament
                        },
                        topics: {
                            id: respQuery.t_id,
                            enabled: respQuery.t_enabled,
                            name: respQuery.t_name,
                            slug: respQuery.t_slug,
                            url_image: respQuery.t_url_image,
                        }
                    });
                }
                return [2 /*return*/, res.status(200).json({
                        data: {
                            data: data,
                            dataRelated: dataRelated
                        },
                        message: "Verse retrieved",
                    })];
            case 11:
                error_9 = _b.sent();
                res.status(500).json({
                    data: null,
                    message: "Internal error",
                });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.getVerseRandomController = getVerseRandomController;
var postVerseSearchController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var text, schemRequest, totalVerses, verses, i, addTopics, where, tops, x, hash_2, arraySet, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = req.body.text;
                schemRequest = {
                    page: Number(req.query.page) - 1 || 0,
                    limit: Number(req.query.limit) || 10
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, (0, verse_helper_1.countSearch)(text.toLowerCase())];
            case 2:
                totalVerses = _a.sent();
                return [4 /*yield*/, (0, verse_helper_1.listSearch)(text.toLowerCase(), schemRequest.page, schemRequest.limit)];
            case 3:
                verses = _a.sent();
                if (verses.length === 0) {
                    return [2 /*return*/, res.status(404).json({
                            data: [],
                            message: "Not found any verse",
                        })];
                }
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < verses.length)) return [3 /*break*/, 9];
                addTopics = [];
                where = '';
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n            SELECT * FROM i_verses_have_topics WHERE verse_id = ".concat(verses[i].id))];
            case 5:
                tops = _a.sent();
                if (!(tops.length > 0)) return [3 /*break*/, 7];
                for (x = 0; x < tops.length; x++) {
                    where += "   ".concat(tops[x].topic_id, " ").concat((tops[x + 1] != undefined) ? ' , ' : ' ', "  ");
                }
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n                SELECT * FROM i_topics AS T\n                     WHERE   T.id  IN ( ".concat(where, " ) "))];
            case 6:
                addTopics = (_a.sent());
                _a.label = 7;
            case 7:
                verses[i] = __assign(__assign({}, verses[i]), { topics: addTopics });
                _a.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 4];
            case 9:
                hash_2 = {};
                arraySet = verses.filter(function (x) { return hash_2[x.id] ? false : (hash_2[x.id] = true); });
                return [2 /*return*/, res.status(200).json({
                        data: {
                            data: arraySet || [],
                            pagination: {
                                total: parseInt(totalVerses[0].total),
                                pages: Math.floor((0, generic_1.calcNumberOfPages)(schemRequest.limit, totalVerses[0].total)),
                                results: verses.length,
                                page: (schemRequest.page) ? schemRequest.page + 1 : 1,
                                limit: schemRequest.limit,
                            },
                        },
                        message: "Verse retrieved",
                    })];
            case 10:
                error_10 = _a.sent();
                console.log(error_10);
                res.status(500).json({
                    data: null,
                    message: "Internal error check your query",
                });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.postVerseSearchController = postVerseSearchController;
var nextVerseController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schemRequest, verses, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schemRequest = {
                    verse_id: Number(req.query.verse_id),
                    limit: Number(req.query.limit) || 10
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, verse_helper_1.getNextVerses)(schemRequest.verse_id, schemRequest.limit)];
            case 2:
                verses = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: {
                            data: verses || [],
                        },
                        message: "Verse retrieved",
                    })];
            case 3:
                error_11 = _a.sent();
                res.status(500).json({
                    data: null,
                    message: "Internal error",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.nextVerseController = nextVerseController;
var verseIdentifierImagesController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, existsVerse, newFile, allowedFileType, urlFileProvider, ids, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identifier = req.params.identifier;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, gettters_1.getByIdentifier)(identifier)];
            case 2:
                existsVerse = _a.sent();
                if (!existsVerse)
                    return [2 /*return*/, res.status(404).json({ data: null, message: "Not found" })];
                newFile = req.file;
                allowedFileType = ["image/png", "image/jpg", "image/jpeg"];
                if (!allowedFileType.includes(newFile.mimetype)) {
                    return [2 /*return*/, res.status(400).json({
                            data: null,
                            message: "Bad request",
                        })];
                }
                return [4 /*yield*/, (0, uploadAWS_helper_1.uploadFile)(newFile, "verses/".concat(newFile.originalname), newFile.mimetype, false)];
            case 3:
                urlFileProvider = _a.sent();
                if (urlFileProvider == '') {
                    return [2 /*return*/, res.status(500).json({
                            data: {},
                            message: "Error uploading file to the provider",
                        })];
                }
                ids = (0, gettters_1.generateVerseId)(existsVerse[0].book_id, existsVerse[0].chapter, existsVerse[0].number);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).update({ id: existsVerse[0].id }, {
                        id: parseInt(ids),
                        book_id: existsVerse[0].book_id,
                        chapter: existsVerse[0].chapter,
                        number: existsVerse[0].number,
                        text: existsVerse[0].text,
                        slug: existsVerse[0].slug,
                        url_image: urlFileProvider
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: __assign(__assign({}, existsVerse[0]), { url_image: urlFileProvider }),
                        message: "Image added to the verse",
                    })];
            case 5:
                error_12 = _a.sent();
                console.log(error_12);
                res.status(500).json({
                    data: null,
                    message: "Internal error",
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.verseIdentifierImagesController = verseIdentifierImagesController;
