"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var topic_controller_1 = require("../controllers/topic.controller");
var middlewares_1 = require("../middlewares");
var multer_1 = __importDefault(require("multer"));
var upload = (0, multer_1.default)({ dest: 'uploads/' });
var router = (0, express_1.Router)();
exports.router = router;
router.post('/topics', [
    (0, express_validator_1.check)('name', 'Name is required').not().isEmpty(),
    middlewares_1.validarCampos
], topic_controller_1.postTopicController);
router.get('/topics', [], topic_controller_1.getTopicController);
router.get('/topics/:identifier', [], topic_controller_1.getTopicIdentifierController);
router.delete('/topics/:id', [], topic_controller_1.deleteTopicByIdController);
router.put('/topics/:id', [], topic_controller_1.putTopicByIdController);
router.put('/topics/:id/images', [upload.single('image')], topic_controller_1.putTopicByIdAndImageController);
router.post('/topics/search', [
    (0, express_validator_1.check)('text', 'Text is required').not().isEmpty(),
    middlewares_1.validarCampos
], topic_controller_1.topicBySearchController);
