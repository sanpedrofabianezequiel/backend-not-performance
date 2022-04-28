"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var media_controller_1 = require("../controllers/media.controller");
var multer_1 = __importDefault(require("multer"));
var upload = (0, multer_1.default)({ dest: 'uploads/' });
var router = (0, express_1.Router)();
exports.router = router;
router.post('/media_items', [upload.single('image')], media_controller_1.postMediaItemsController);
router.delete('/media_items/:identifier', [], media_controller_1.mediaItemsIdentifierController);
router.get('/media_items', [], media_controller_1.getMediaItemsController);
