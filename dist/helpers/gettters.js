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
exports.generateVerseId = exports.getByChapterSlug = exports.getByIdentifier = void 0;
var typeorm_1 = require("typeorm");
var generic_entity_1 = require("../entity/generic.entity");
var getByIdentifier = function (identifier) { return __awaiter(void 0, void 0, void 0, function () {
    var response, result, identifierSplit, _i, response_1, resp, _a, response_2, resp, _b, response_3, resp, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                result = [];
                identifierSplit = identifier.split('-');
                _c.label = 1;
            case 1:
                _c.trys.push([1, 8, , 9]);
                if (!(identifierSplit.length == 3)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n      SELECT  (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n              (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at\n        FROM i_verses AS V\n        INNER JOIN i_books as B ON V.book_id = B.id\n        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id\n        WHERE B.slug = '".concat(identifierSplit[0].toLowerCase(), "' AND V.chapter = ").concat(parseInt(identifierSplit[1]), " AND V.number=").concat(parseInt(identifierSplit[2]), "\n      "))];
            case 2:
                response = (_c.sent());
                for (_i = 0, response_1 = response; _i < response_1.length; _i++) {
                    resp = response_1[_i];
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
                            number: resp.b_number,
                            name: resp.b_name,
                            slug: resp.b_slug,
                            testament: resp.b_testament,
                            number_chapters: resp.b_number_chapters
                        },
                        topics: {
                            id: resp.t_id,
                            name: resp.t_name,
                            slug: resp.t_slug,
                            enabled: resp.t_enabled,
                            url_image: resp.t_url_image,
                        },
                    });
                }
                return [3 /*break*/, 7];
            case 3:
                if (!!isNaN(parseInt(identifierSplit[0]))) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n      SELECT  (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n              (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at\n        FROM i_verses AS V\n        INNER JOIN i_books as B ON V.book_id = B.id\n        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id\n        WHERE B.slug = '".concat(parseInt(identifierSplit[0]), "-").concat(identifierSplit[1].toLocaleLowerCase(), "' AND V.chapter = ").concat(parseInt(identifierSplit[2]), " AND V.number=").concat(parseInt(identifierSplit[3]), "\n      "))];
            case 4:
                response = (_c.sent());
                for (_a = 0, response_2 = response; _a < response_2.length; _a++) {
                    resp = response_2[_a];
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
                            number: resp.b_number,
                            name: resp.b_name,
                            slug: resp.b_slug,
                            testament: resp.b_testament,
                            number_chapters: resp.b_number_chapters
                        },
                        topics: {
                            id: resp.t_id,
                            name: resp.t_name,
                            slug: resp.t_slug,
                            enabled: resp.t_enabled,
                            url_image: resp.t_url_image,
                        },
                    });
                }
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n      SELECT  (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n              (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at\n        FROM i_verses AS V\n        INNER JOIN i_books as B ON V.book_id = B.id\n        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id\n        WHERE B.slug = '".concat(identifierSplit[0].toLowerCase(), "' AND V.chapter = ").concat(parseInt(identifierSplit[1]), " AND V.number=").concat(parseInt(identifierSplit[2]), "\n      "))];
            case 6:
                response = (_c.sent());
                for (_b = 0, response_3 = response; _b < response_3.length; _b++) {
                    resp = response_3[_b];
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
                            number: resp.b_number,
                            name: resp.b_name,
                            slug: resp.b_slug,
                            testament: resp.b_testament,
                            number_chapters: resp.b_number_chapters
                        },
                        topics: {
                            id: resp.t_id,
                            name: resp.t_name,
                            slug: resp.t_slug,
                            enabled: resp.t_enabled,
                            url_image: resp.t_url_image,
                        },
                    });
                }
                _c.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _c.sent();
                console.log("error", error_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/, result];
        }
    });
}); };
exports.getByIdentifier = getByIdentifier;
var getByChapterSlug = function (identifier) { return __awaiter(void 0, void 0, void 0, function () {
    var identifierSplit, data, response, bookSlug, chapter, _i, response_4, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identifierSplit = identifier.split('-');
                data = [];
                response = [];
                bookSlug = identifierSplit.slice(0, identifierSplit.length - 1).join('-');
                chapter = identifierSplit[identifierSplit.length - 1];
                if (!!isNaN(chapter)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n      SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,\n            (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,\n            (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image\n        FROM i_verses AS V\n        LEFT JOIN i_books AS B ON V.book_id = B.id\n        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id\n        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id\n        WHERE V.chapter = ".concat(chapter, " and B.slug = '").concat(bookSlug, "'\n      "))];
            case 1:
                response = (_a.sent());
                _a.label = 2;
            case 2:
                for (_i = 0, response_4 = response; _i < response_4.length; _i++) {
                    resp = response_4[_i];
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
                            number: resp.b_number,
                            name: resp.b_name,
                            slug: resp.b_slug,
                            testament: resp.b_testament,
                            number_chapters: resp.b_number_chapters
                        },
                        topics: {
                            id: resp.t_id,
                            name: resp.t_name,
                            slug: resp.t_slug,
                            enabled: resp.t_enabled,
                            url_image: resp.t_url_image,
                        },
                    });
                }
                return [2 /*return*/, data];
        }
    });
}); };
exports.getByChapterSlug = getByChapterSlug;
var generateVerseId = function (bookId, chapter, number) {
    var bookIdForVerseId = bookId <= 9 ? "0".concat(bookId) : bookId;
    var chapterForVerseId = chapter <= 9 ? "00".concat(chapter) : chapter <= 99 ? "0".concat(chapter) : chapter;
    var numberForVerseId = number <= 9 ? "00".concat(number) : number <= 99 ? "0".concat(number) : number;
    return "".concat(bookIdForVerseId).concat(chapterForVerseId).concat(numberForVerseId);
};
exports.generateVerseId = generateVerseId;
