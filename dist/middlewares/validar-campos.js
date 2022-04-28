"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCampos = void 0;
var express_validator_1 = require("express-validator");
var validarCampos = function (req, res, next) {
    var error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error);
    }
    next();
};
exports.validarCampos = validarCampos;
