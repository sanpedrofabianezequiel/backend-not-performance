"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var reading_plan_controller_1 = require("../controllers/reading-plan.controller");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
exports.router = router;
router.post('/reading_plans', [
    (0, express_validator_1.check)('name', "Name is required").not().isEmpty(),
    (0, express_validator_1.check)('email', "Emial is required").not().isEmpty().isEmail(),
    (0, express_validator_1.check)('days', "Days is required").not().isEmpty(),
    (0, express_validator_1.check)('start_date', "Start date is required").not().isEmpty(),
    (0, express_validator_1.check)('marked_days', "Marked days is required").not().isEmpty(),
    middlewares_1.validarCampos
], reading_plan_controller_1.readingPlansController);
