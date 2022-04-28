"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var contact_controller_1 = require("../controllers/contact.controller");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
exports.router = router;
router.post('/contact', [
    (0, express_validator_1.check)('name', "Name is required").not().isEmpty(),
    (0, express_validator_1.check)('email', "Email is required").not().isEmpty().isEmail(),
    (0, express_validator_1.check)('message', "Message is required").not().isEmpty(),
    (0, express_validator_1.check)('phone', "Phone is required").not().isEmpty(),
    middlewares_1.validarCampos
], contact_controller_1.contactController);
