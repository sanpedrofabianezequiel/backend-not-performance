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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupVersesByBookChapter = exports.getNextVerses = exports.listSearch = exports.countSearch = exports.getFormatSearch = void 0;
var typeorm_1 = require("typeorm");
var Verse_entity_1 = require("../entity/Verse.entity");
var generic_entity_1 = require("../entity/generic.entity");
var books = [];
var booksSlugs = [];
var getFormatSearch = function (text) {
    if (text === void 0) { text = ''; }
    var where = '';
    var result = {
        valid: false,
        firstComponent: {
            bookName: '',
            chapter: 0,
            items: 0
        },
        secondComponent: {
            numvers: []
        }
    };
    try {
        var textSplit = text.split(' ');
        var textSplitAll = textSplit.slice(0, textSplit.length - 1);
        var textSplitAllReduce = textSplitAll.reduce(function (acum, x) { return acum + x + " "; }, "");
        var textSplitAllReduceSlice = textSplitAllReduce.slice(0, textSplitAllReduce.length - 1);
        var textChapterAndNumber = textSplit.slice(textSplit.length - 1, textSplit.length);
        if (!text.includes(':')) {
            result.firstComponent.chapter = Number(textChapterAndNumber);
            result.firstComponent.bookName = textSplitAllReduceSlice;
            if (result.firstComponent.chapter) {
                where += " B.name LIKE '%".concat(result.firstComponent.bookName, "%' AND V.chapter = ").concat(result.firstComponent.chapter);
            }
            else if (textSplit.length === 1) {
                console.log('emtre');
                where += "  (B.name like '%".concat(text, "%' OR V.text LIKE '%").concat(text, "%') ");
            }
            else {
                where += " V.text LIKE '%".concat(text, "%'");
            }
        }
        else {
            var formatText = text.split(':');
            result.firstComponent.bookName = textSplitAllReduceSlice;
            result.firstComponent.chapter = parseInt(textChapterAndNumber[0]);
            result.secondComponent.numvers = formatText[1].split('-').map(function (v) { return parseInt(v); });
            if (result.secondComponent.numvers.length === 2) {
                where += " B.name LIKE '%".concat(result.firstComponent.bookName, "%' AND V.chapter = ").concat(result.firstComponent.chapter, " AND V.number BETWEEN ").concat(result.secondComponent.numvers[0], " AND ").concat(result.secondComponent.numvers[1]);
            }
            else if (result.secondComponent.numvers.length === 1) {
                where += " B.name LIKE '%".concat(result.firstComponent.bookName, "%' AND V.chapter = ").concat(result.firstComponent.chapter, " AND V.number = ").concat(result.secondComponent.numvers[0]);
            }
        }
        return where;
    }
    catch (error) {
        return '';
    }
};
exports.getFormatSearch = getFormatSearch;
var countSearch = function (text) {
    if (text === void 0) { text = ''; }
    return __awaiter(void 0, void 0, void 0, function () {
        var query, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = " SELECT COUNT(*) AS total FROM i_verses AS V  LEFT JOIN i_books AS B ON V.book_id = B.id  ";
                    query += "  WHERE  ".concat((0, exports.getFormatSearch)(text), " ");
                    return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query(query)];
                case 1:
                    count = _a.sent();
                    return [2 /*return*/, count];
            }
        });
    });
};
exports.countSearch = countSearch;
var listSearch = function (text, page, limit) {
    if (text === void 0) { text = ''; }
    if (page === void 0) { page = 1; }
    if (limit === void 0) { limit = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var query, response, listSearch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = " SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n                    (VTH.id) AS vth_id,(VTH.verse_id) vth_verse_id,(VTH.topic_id) vth_topic_id,\n                    (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at,(T.updated_at) t_updated_at,(T.deleted_at) t_deleted_at,\n                    (B.id) b_id,(B.number) b_number,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,(B.name) b_name\n                FROM i_verses AS V\n    ";
                    query += "INNER JOIN i_books as B ON V.book_id = B.id\n            LEFT JOIN i_verses_have_topics AS VTH ON V.id = VTH.verse_id\n            LEFT JOIN i_topics AS T ON VTH.topic_id = T.id";
                    query += "  WHERE  ".concat((0, exports.getFormatSearch)(text), " LIMIT ").concat(page * limit, ",").concat(limit, " ");
                    return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query(query)];
                case 1:
                    response = _a.sent();
                    listSearch = response.map(function (x) {
                        return {
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
                            topics: {
                                id: x.t_id,
                                enabled: x.t_enabled,
                                name: x.t_name,
                                slug: x.t_slug,
                                url_image: x.t_url_image
                            }
                        };
                    });
                    return [2 /*return*/, listSearch];
            }
        });
    });
};
exports.listSearch = listSearch;
var countNextVerses = function (verseId) { return __awaiter(void 0, void 0, void 0, function () {
    var where, count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                where = {
                    id: (0, typeorm_1.MoreThan)(verseId),
                };
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Verse_entity_1.IVerses).count({
                        where: where,
                    })];
            case 1:
                count = _a.sent();
                return [2 /*return*/, count];
        }
    });
}); };
var getNextVerses = function (verseId, limit) { return __awaiter(void 0, void 0, void 0, function () {
    var count, data, result, _i, data_1, resp, diff, versesBefore, versesB, _a, versesBefore_1, resp, versesAfter, versesAf, _b, versesAfter_1, resp_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, countNextVerses(verseId)];
            case 1:
                count = _c.sent();
                result = [];
                if (!(count > limit)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n                (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n                (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n            FROM i_verses AS V\n            INNER join i_books as B ON V.book_id = B.id\n            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n            INNER JOIN i_topics AS T ON VHT.topic_id = T.id\n            WHERE V.id > ".concat(verseId, "\n            LIMIT ").concat(limit, "\n        "))];
            case 2:
                data = (_c.sent());
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    resp = data_1[_i];
                    result.push({
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
                return [3 /*break*/, 8];
            case 3:
                diff = limit - count;
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n          FROM i_verses AS V\n          INNER join i_books as B ON V.book_id = B.id\n          INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n          INNER JOIN i_topics AS T ON VHT.topic_id = T.id\n          WHERE V.id > ".concat(verseId, "\n          LIMIT ").concat(limit, "\n        "))];
            case 4:
                versesBefore = _c.sent();
                versesB = [];
                _a = 0, versesBefore_1 = versesBefore;
                _c.label = 5;
            case 5:
                if (!(_a < versesBefore_1.length)) return [3 /*break*/, 8];
                resp = versesBefore_1[_a];
                versesB.push({
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
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled\n          FROM i_verses AS V\n          INNER JOIN i_books as B ON V.book_id = B.id\n          INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n          INNER JOIN i_topics AS T ON VHT.topic_id = T.id\n          LIMIT ".concat(diff, "\n        "))];
            case 6:
                versesAfter = _c.sent();
                versesAf = [];
                for (_b = 0, versesAfter_1 = versesAfter; _b < versesAfter_1.length; _b++) {
                    resp_1 = versesAfter_1[_b];
                    versesAf.push({
                        id: resp_1.id,
                        book_id: resp_1.book_id,
                        chapter: resp_1.chapter,
                        number: resp_1.number,
                        slug: resp_1.slug,
                        text: resp_1.text,
                        url_image: resp_1.url_image,
                        book: {
                            id: resp_1.b_id,
                            name: resp_1.b_name,
                            number: resp_1.b_number,
                            number_chapters: resp_1.b_number_chapters,
                            slug: resp_1.b_slug,
                            testament: resp_1.b_testament
                        },
                        topics: {
                            id: resp_1.t_id,
                            enabled: resp_1.t_enabled,
                            name: resp_1.t_name,
                            slug: resp_1.t_slug,
                            url_image: resp_1.t_url_image,
                        }
                    });
                }
                result = __spreadArray(__spreadArray([], versesB, true), versesAf, true);
                _c.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/, result];
        }
    });
}); };
exports.getNextVerses = getNextVerses;
var groupVersesByBookChapter = function (verses) {
    var _a, _b;
    var versesGroupedByChapterBook = [];
    versesGroupedByChapterBook.push({
        bookName: (_a = verses[0].book) === null || _a === void 0 ? void 0 : _a.name,
        chapter: verses[0].chapter,
        verses: []
    });
    var currentGroupId = 0;
    for (var i = 0; i < verses.length; i++) {
        var v = verses[i];
        if (v.chapter != versesGroupedByChapterBook[currentGroupId].chapter) { // Change the chapter or book
            versesGroupedByChapterBook.push({
                bookName: (_b = v.book) === null || _b === void 0 ? void 0 : _b.name,
                chapter: v.chapter,
                verses: [{
                        number: v.number,
                        text: v.text
                    }]
            });
            currentGroupId++;
        }
        else {
            versesGroupedByChapterBook[currentGroupId].verses.push({
                number: v.number,
                text: v.text
            });
        }
    }
    return versesGroupedByChapterBook;
};
exports.groupVersesByBookChapter = groupVersesByBookChapter;
