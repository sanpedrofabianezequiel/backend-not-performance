"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var verse_controller_1 = require("../controllers/verse.controller");
var middlewares_1 = require("../middlewares");
var multer_1 = __importDefault(require("multer"));
var upload = (0, multer_1.default)({ dest: 'uploads/' });
var router = (0, express_1.Router)();
exports.router = router;
router.post('/verses', [
    (0, express_validator_1.check)('book_id', "book_id is required").not().isEmpty(),
    (0, express_validator_1.check)('chapter', "chapter is required").not().isEmpty(),
    (0, express_validator_1.check)('number', 'number is required').not().isEmpty(),
    (0, express_validator_1.check)('text', 'text is required').not().isEmpty(),
    middlewares_1.validarCampos
], verse_controller_1.postVersesController);
//router.get('/verses/router_info',[],getVersesRouterInfoController);
//router.get('/verses',[],getVersesController);
router.get('/verses/:identifier', [], verse_controller_1.getVersesIdentifierController);
router.get('/bookschapters/verses/:identifier', [], verse_controller_1.getBooksChaptersController);
router.delete('/verses/:id', [], verse_controller_1.deleteVerseByIdController);
router.put('/verses/:id', [
    (0, express_validator_1.check)('book_id', "book_id is required").not().isEmpty(),
    (0, express_validator_1.check)('chapter', "chapter is required").not().isEmpty(),
    (0, express_validator_1.check)('number', 'number is required').not().isEmpty(),
    (0, express_validator_1.check)('text', 'text is required').not().isEmpty(),
    middlewares_1.validarCampos
], verse_controller_1.putVerseByIdController);
//router.get('/verses/random/random',[],getVerseRandomController);
router.post('/verses/search', [
    (0, express_validator_1.check)('text', 'text is required').not().isEmpty(),
    middlewares_1.validarCampos
], verse_controller_1.postVerseSearchController);
//router.get('/next_verses',[],nextVerseController);
router.put('/verses/:identifier/images', [upload.single('image')], verse_controller_1.verseIdentifierImagesController);
router.get('/verses/with/images', [], verse_controller_1.getVerseWithImagesController);
