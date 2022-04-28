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
exports.putBookByIdController = exports.deleteBookByIdController = exports.booksChapterController = exports.booksIdentifierController = exports.booksController = exports.bookController = void 0;
var typeorm_1 = require("typeorm");
var Book_entity_1 = require("../entity/Book.entity");
var generic_1 = require("../helpers/generic");
var generic_entity_1 = require("../entity/generic.entity");
var bookController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, number, name, testament, bookByNumberAndName, newBook, book, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, number = _a.number, name = _a.name, testament = _a.testament;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (!(testament == Book_entity_1.ETestament.OT || testament == Book_entity_1.ETestament.NT))
                    return [2 /*return*/, res.status(404).json({ data: null, message: 'Testament invalid. You should use OT or NT' })];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: [
                            { name: name },
                            { number: number }
                        ]
                    })];
            case 2:
                bookByNumberAndName = _b.sent();
                if (bookByNumberAndName)
                    return [2 /*return*/, res.status(409).json({ data: null, message: 'Already exists a book with the same number or name' })];
                newBook = (0, typeorm_1.getRepository)(Book_entity_1.IBooks).create({
                    slug: name === null || name === void 0 ? void 0 : name.toLowerCase().trim().replace(/ /g, '-'),
                    name: name,
                    number: number,
                    testament: testament
                });
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).save(newBook)];
            case 3:
                book = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: book || [], message: 'Book retrieved' })];
            case 4:
                error_1 = _b.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.bookController = bookController;
var booksController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schemaQuery, _a, books, totalBooks, error_2;
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
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findAndCount({
                        skip: schemaQuery.page,
                        take: schemaQuery.limit
                    })];
            case 2:
                _a = _b.sent(), books = _a[0], totalBooks = _a[1];
                return [2 /*return*/, res.status(200).json({
                        data: books || [],
                        pagination: {
                            total: totalBooks,
                            pages: Math.floor((0, generic_1.calcNumberOfPages)(schemaQuery.limit, totalBooks)),
                            results: books.length,
                            page: schemaQuery.page,
                            limit: schemaQuery.limit == -1 ? books.length : schemaQuery.limit
                        },
                        message: 'Book retrieved',
                    })];
            case 3:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, res.status(500).json({ data: null, message: 'Internal error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.booksController = booksController;
var booksIdentifierController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, book, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identifier = req.params.identifier;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                book = void 0;
                if (!isNaN(Number(identifier))) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: {
                            slug: identifier
                        }
                    })];
            case 2:
                book = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                    where: [
                        { id: identifier },
                        { slug: identifier }
                    ]
                })];
            case 4:
                book = _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, res.status(200).json({
                    data: book,
                })];
            case 6:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        msg: 'Internal error'
                    })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.booksIdentifierController = booksIdentifierController;
var booksChapterController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schemaQuery, response, data, _i, response_1, x, i, addTopics, where, tops, x, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schemaQuery = {
                    page: Number(req.query.page) - 1 || 0,
                    limit: Number(req.query.limit) || 10
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(generic_entity_1.IGeneric).query("\n        SELECT (V.id) AS id,(V.book_id)  AS book_id,(V.chapter) AS chapter,(V.number) AS number, (V.slug)       AS slug, (V.text) AS text,(V.url_image) AS url_image,\n               (B.id) AS bid, (B.number) AS bnumber,(B.name)    AS bname,(B.slug)     AS bslug,(B.testament)    AS btestament, (B.number_chapters) AS number_chapters,\n               (T.id) AS tid, (T.name)   AS tname,(T.slug)      AS tslug,(T.enabled)  AS tenabled,(T.url_image) AS turl_image\n        FROM i_verses AS V\n        INNER JOIN i_books AS B ON V.book_id = B.id\n        INNER JOIN i_verses_have_topics as VHT ON V.id = VHT.verse_id\n        INNER JOIN i_topics T ON VHT.topic_id = T.id\n        WHERE V.book_id = ".concat(req.params.book_id, " AND V.chapter = ").concat(req.params.chapter, "\n        LIMIT ").concat(schemaQuery.page, ", ").concat(schemaQuery.limit, "\n        "))];
            case 2:
                response = _a.sent();
                data = [];
                for (_i = 0, response_1 = response; _i < response_1.length; _i++) {
                    x = response_1[_i];
                    data.push({
                        id: x.id,
                        book_id: x.book_id || -1,
                        number: x.number || -1,
                        slug: x.slug || '',
                        text: x.text || '',
                        url_image: x.url_image || '',
                        book: {
                            id: x.bid,
                            number: x.bnumber,
                            name: x.bname || '',
                            slug: x.bslug || '',
                            testament: x.btestament || '',
                            number_chapters: x.number_chapters,
                        },
                        topics: {
                            id: x.tid,
                            name: x.tname,
                            slug: x.tslug,
                            enabled: x.tenabled,
                            url_image: x.turl_image,
                        }
                    });
                }
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
            case 8: return [2 /*return*/, res.status(200).json({
                    data: data,
                    message: "Verses retrieved",
                })];
            case 9:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        msg: 'Internal error'
                    })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.booksChapterController = booksChapterController;
var deleteBookByIdController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existBook, book, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                existBook = _a.sent();
                if (!existBook)
                    return [2 /*return*/, res.status(404).json({ data: null, message: 'Not found' })];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).delete({ id: parseInt(id) })];
            case 3:
                book = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: book,
                        message: 'Book deleted'
                    })];
            case 4:
                error_5 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        data: null,
                        msg: 'Internal error'
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteBookByIdController = deleteBookByIdController;
var putBookByIdController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, number, name, testament, id, slug, existBook, bookByNumber, bookByName, bookUpdate, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, number = _a.number, name = _a.name, testament = _a.testament;
                id = req.params.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                existBook = _b.sent();
                if (!existBook)
                    return [2 /*return*/, res.status(404).json({ data: null, message: 'Not found' })];
                if (!(number != existBook.number)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: {
                            number: number
                        }
                    })];
            case 3:
                bookByNumber = _b.sent();
                if (bookByNumber) {
                    return [2 /*return*/, res.status(409).json({ data: null, message: 'Already exists a book with the same number' })];
                }
                _b.label = 4;
            case 4:
                if (!(name != existBook.name)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: {
                            name: name
                        }
                    })];
            case 5:
                bookByName = _b.sent();
                if (bookByName) {
                    return [2 /*return*/, res.status(409).json({ data: null, message: 'Already exists a book with the same name' })];
                }
                _b.label = 6;
            case 6:
                if (name) {
                    slug = name.toLowerCase().trim();
                }
                existBook.id = parseInt(id);
                existBook.name = name;
                existBook.number = number;
                existBook.testament = testament;
                existBook.slug = slug;
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).update({ id: parseInt(id) }, existBook)];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(Book_entity_1.IBooks).findOne({
                        where: {
                            id: id
                        }
                    })];
            case 8:
                bookUpdate = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        data: bookUpdate,
                        message: 'Book updated'
                    })];
            case 9:
                error_6 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        ok: false,
                        data: null,
                        msg: 'Internal error'
                    })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.putBookByIdController = putBookByIdController;
