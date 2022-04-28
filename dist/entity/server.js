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
exports.Server = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//import swaggerUI from 'swagger-ui-express';
//import * as swaggerDocuments from '../swagger.json';
var books_router_1 = require("../routes/books.router");
var daily_verse_router_1 = require("../routes/daily_verse.router");
var media_router_1 = require("../routes/media.router");
var reading_plan_router_1 = require("../routes/reading-plan.router");
var subscription_router_1 = require("../routes/subscription.router");
var testimonie_router_1 = require("../routes/testimonie.router");
var topic_router_1 = require("../routes/topic.router");
var verse_topic_router_1 = require("../routes/verse_topic.router");
var verse_router_1 = require("../routes/verse.router");
var contact_router_1 = require("../routes/contact.router");
var node_cron_1 = __importDefault(require("node-cron"));
var cron_1 = require("../helpers/cron");
var URL = '/api';
var Server = /** @class */ (function () {
    function Server() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 8080;
        this.path = {
            booksPath: URL,
            dailyVersePath: URL,
            mediaPath: URL,
            readingPlansPath: URL,
            subscriptionPath: URL,
            testimoniePath: URL,
            topicPath: URL,
            verseTopicPath: URL,
            versePath: URL,
            contactPath: URL,
        };
        this.conectarDB();
        this.middlewares();
        this.routes();
    }
    Server.prototype.conectarDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, typeorm_1.createConnection)({
                                type: "mysql",
                                host: (process.env.DATABASE_HOST),
                                port: parseInt(process.env.DATABASE_PORT) || 3306,
                                username: process.env.DATABASE_USER,
                                password: process.env.DATABASE_PASSWORD,
                                database: process.env.DATABASE_NAME,
                                entities: ["dist/entity/**/*.js"],
                                synchronize: true,
                                logging: true
                            })];
                    case 1:
                        _a.sent();
                        console.log('Database On');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.middlewares = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allowedOrigins;
            var _this = this;
            return __generator(this, function (_a) {
                allowedOrigins = ["*", "http://127.0.0.1:3000", "http://localhost:3000", "http://localhost:8080", "http://bibleverses.net", "https://bibleverses.net", "https://admin.bibleverses.net", "https://bibleversesnet.herokuapp.com"];
                this.app.use((0, cors_1.default)({
                    origin: allowedOrigins
                }));
                this.app.use(body_parser_1.default.urlencoded({ extended: false }));
                this.app.use(express_1.default.json());
                this.app.use(express_1.default.static('public'));
                /*this.app.use('/swagger',swaggerUI.serve,swaggerUI.setup(swaggerDocuments));*/
                try {
                    //await loadBookInCache();
                    node_cron_1.default.schedule('0 8 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, cron_1.sendReadingPlanMessages)()];
                                case 1:
                                    _a.sent();
                                    console.log('0 8 * * * sending reading plan messages');
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_cron_1.default.schedule('0 7 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('0 7 * * * sending daily verses');
                                    return [4 /*yield*/, (0, cron_1.sendDailyVerses)()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (error) {
                    console.log("Verso diario con problemas", error);
                }
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.routes = function () {
        this.app.use(this.path.booksPath, books_router_1.router);
        this.app.use(this.path.versePath, verse_router_1.router);
        this.app.use(this.path.mediaPath, media_router_1.router);
        this.app.use(this.path.dailyVersePath, daily_verse_router_1.router);
        this.app.use(this.path.readingPlansPath, reading_plan_router_1.router);
        this.app.use(this.path.subscriptionPath, subscription_router_1.router);
        this.app.use(this.path.testimoniePath, testimonie_router_1.router);
        this.app.use(this.path.topicPath, topic_router_1.router);
        this.app.use(this.path.verseTopicPath, verse_topic_router_1.router);
        this.app.use(this.path.contactPath, contact_router_1.router);
    };
    Server.prototype.listen = function () {
        var _this = this;
        this.app.listen(this.port, function () {
            console.log("Server on in ".concat(_this.port));
        });
    };
    return Server;
}());
exports.Server = Server;
