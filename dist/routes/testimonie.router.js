"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var testimony_controller_1 = require("../controllers/testimony.controller");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
exports.router = router;
router.post('/testimonies', [
    (0, express_validator_1.check)('title', "title is required").not().isEmpty(),
    (0, express_validator_1.check)('content', "content is required").not().isEmpty(),
    middlewares_1.validarCampos
], testimony_controller_1.postTestimoniesController);
router.get('/testimonies', [], testimony_controller_1.getTestimoniesController);
