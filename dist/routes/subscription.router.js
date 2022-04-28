"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var subscription_controller_1 = require("../controllers/subscription.controller");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
exports.router = router;
router.post('/subscriptions', [
    (0, express_validator_1.check)('type', "Type is required").not().isEmpty(),
    middlewares_1.validarCampos
], subscription_controller_1.subscriptionController);
router.delete('/subscriptions/:id/:type', [], subscription_controller_1.subscriptionByIdAndTypeController);
router.get('/unsubscriptions/:email', [], subscription_controller_1.unsubscriptionController);
router.get('/subscriptions', [], subscription_controller_1.subscriptionAllController);
