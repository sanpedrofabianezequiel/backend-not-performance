"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var daily_verse_controller_1 = require("../controllers/daily-verse.controller");
var router = (0, express_1.Router)();
exports.router = router;
router.get('/dailyverses', [], daily_verse_controller_1.dailyVerseController);
