"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var book_controller_1 = require("../controllers/book.controller");
var validar_campos_1 = require("../middlewares/validar-campos");
var router = (0, express_1.Router)();
exports.router = router;
router.post('/books', [
    (0, express_validator_1.check)('number', "Number is required").not().isEmpty(),
    (0, express_validator_1.check)('name', "Name is required").not().isEmpty(),
    (0, express_validator_1.check)('testament', "Testament is required").not().isEmpty(),
    validar_campos_1.validarCampos
], book_controller_1.bookController);
router.get('/books', [], book_controller_1.booksController);
router.get('/books/:identifier', [], book_controller_1.booksIdentifierController);
//router.get('/books/:book_id/chapters/:chapter',[],booksChapterController);
router.delete('/books/:id', [], book_controller_1.deleteBookByIdController);
router.put('/books/:id', [
    (0, express_validator_1.check)('number', "Number is required").not().isEmpty(),
    (0, express_validator_1.check)('name', "Name is required").not().isEmpty(),
    (0, express_validator_1.check)('testament', "Testament is required").not().isEmpty(),
    validar_campos_1.validarCampos
], book_controller_1.putBookByIdController);
