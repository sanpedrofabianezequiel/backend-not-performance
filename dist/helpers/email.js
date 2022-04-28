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
exports.sendDailyVerse = exports.sendVersesPlanReading = exports.sendContactMessage = exports.sendCreationReadingPlan = exports.sendWelcomeSubscription = void 0;
var fs_1 = __importDefault(require("fs"));
var moment_1 = __importDefault(require("moment"));
var mustache_1 = __importDefault(require("mustache"));
var mail_1 = __importDefault(require("@sendgrid/mail"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var sendWelcomeSubscription = function (email, verse) { return __awaiter(void 0, void 0, void 0, function () {
    var template, renderedHtml, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.default.readFileSync("".concat(__dirname, "/utils/email_templates/welcome.html"), 'utf-8')];
            case 1:
                template = _a.sent();
                renderedHtml = mustache_1.default.render(template, {
                    verse: verse,
                    unsubscribe: email
                });
                mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
                msg = {
                    to: email,
                    from: {
                        name: 'Bibleverses.net',
                        email: process.env.SENDGRID_FROM
                    },
                    subject: 'Your Subscribed Successfully',
                    text: 'Welcome to Your Daily Bible Verse',
                    html: renderedHtml
                };
                mail_1.default
                    .send(msg)
                    .then(function () {
                    console.log('Email sent');
                })
                    .catch(function (error) {
                    console.error(error);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.sendWelcomeSubscription = sendWelcomeSubscription;
var sendCreationReadingPlan = function (email, startDate, endDate, days) { return __awaiter(void 0, void 0, void 0, function () {
    var template, listDayNames, dayNames, renderedHtml, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.default.readFileSync("".concat(__dirname, "/utils/email_templates/creation_reading_plan.html"), 'utf-8')];
            case 1:
                template = _a.sent();
                listDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                dayNames = days.map(function (d) { return listDayNames[d]; });
                renderedHtml = mustache_1.default.render(template, {
                    email: email,
                    startDate: (0, moment_1.default)(startDate).format('MMMM DD, YYYY'),
                    endDate: (0, moment_1.default)(endDate).format('MMMM DD, YYYY'),
                    days: dayNames.join(','),
                    unsubscribe: email
                });
                mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
                msg = {
                    to: email,
                    from: {
                        name: 'Bibleverses.net',
                        email: process.env.SENDGRID_FROM
                    },
                    subject: 'You verses for today',
                    text: "You have created your reading plan successfully.",
                    html: renderedHtml
                };
                mail_1.default
                    .send(msg)
                    .then(function () {
                    console.log('Email reading_plan sent');
                })
                    .catch(function (error) {
                    console.error(error);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.sendCreationReadingPlan = sendCreationReadingPlan;
var sendContactMessage = function (email, name, phone, subject, message) {
    var template = "\n    <h2>A new contact message has arrived</h2>\n\n    <ul>\n        <li><b>Name</b>: {{name}}</li>\n        <li><b>Email</b>: {{email}}</li>\n        <li><b>Phone</b>: {{phone}}</li>\n        <li><b>Subject</b>: {{subject}}</li>\n        <li><b>Message</b>: {{message}}</li>\n    </ul>\n    ";
    var renderedHtml = mustache_1.default.render(template, {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message
    });
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    var msg = {
        to: process.env.SENDGRID_FROM,
        from: process.env.SENDGRID_FROM,
        subject: subject,
        text: renderedHtml,
        html: renderedHtml
    };
    mail_1.default
        .send(msg)
        .then(function () {
        console.log('Email sent');
    })
        .catch(function (error) {
        console.error(error);
    });
};
exports.sendContactMessage = sendContactMessage;
var sendVersesPlanReading = function (email, subject, versesGroupedByChapterBook, planInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var template, renderedHtml, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(email, subject, versesGroupedByChapterBook, planInfo);
                return [4 /*yield*/, fs_1.default.readFileSync("".concat(__dirname, "/utils/email_templates/daily_reading_plan.html"), 'utf-8')];
            case 1:
                template = _a.sent();
                renderedHtml = mustache_1.default.render(template, {
                    versesGroupedByChapterBook: versesGroupedByChapterBook,
                    planInfo: planInfo,
                    unsubscribe: email
                });
                mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
                msg = {
                    to: email,
                    from: process.env.SENDGRID_FROM,
                    subject: subject,
                    text: "Welcome to the Bible Reading Plan.",
                    html: renderedHtml
                };
                mail_1.default
                    .send(msg)
                    .then(function () {
                    console.log('Email sent');
                })
                    .catch(function (error) {
                    console.error(error);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.sendVersesPlanReading = sendVersesPlanReading;
var sendDailyVerse = function (listEmailToSend, subject, verse) { return __awaiter(void 0, void 0, void 0, function () {
    var template, renderedHtml, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(verse);
                return [4 /*yield*/, fs_1.default.readFileSync("".concat(__dirname, "/utils/email_templates/daily_verse.html"), 'utf-8')];
            case 1:
                template = _a.sent();
                renderedHtml = mustache_1.default.render(template, verse);
                mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
                msg = {
                    to: listEmailToSend,
                    from: {
                        name: 'Bibleverses.net',
                        email: process.env.SENDGRID_FROM
                    },
                    subject: subject,
                    text: "Bible verse of the day",
                    html: renderedHtml
                };
                mail_1.default
                    .send(msg)
                    .then(function () {
                    console.log('Email sent');
                })
                    .catch(function (error) {
                    console.error(error);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.sendDailyVerse = sendDailyVerse;
